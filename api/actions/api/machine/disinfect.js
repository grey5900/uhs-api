/**
 * Created by yang on 16/7/15.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getCurrentQueue} from '../../../kue';
import {kJobMachineDisinfect} from '../../../kue/constants';
import {getTime} from '../../lib/util';
import {roleAuthPromise} from '../../lib/auth';

const DialysisMachine = mongoose.model('DialysisMachine');

export default function (req) {
  return roleAuthPromise(req, 'update', 'DialysisMachine', (resolve, reject) => {
    const {id, disinfect} = req.body;
    if (id) {
      DialysisMachine.findOneAndUpdate({_id: id}, {disinfect, update_time: getTime()}, (error) => {
        if (error) {
          console.log(error);
          reject({msg: error.message});
        } else {
          if (disinfect === 1) {
            // will create delayed job to check machine status
            DialysisMachine.findOne({_id: id})
              .populate('brand_reference')
              .exec((error, machine) => {
                if (error) {
                  console.log(error);
                  reject({msg: error.message});
                } else {
                  const {user} = req.session;
                  let {disinfect_time} = machine.brand_reference;
                  disinfect_time = parseInt(disinfect_time, 10) * 60 * 1000; // covert minutes to milliseconds
                  getCurrentQueue((queue) => {
                    console.log('create job:', kJobMachineDisinfect, id, disinfect_time, user._id, resolve);
                    queue.create(kJobMachineDisinfect, {machine: id, creator: user._id})
                      .delay(disinfect_time)
                      .save(function(error) {
                        console.log('create job error:', error);
                      });
                  });
                  resolve({code: config.code.message});
                }
              });
          } else {
            resolve({code: config.code.success});
          }
        }
      });
    } else {
      reject({msg: '缺少参数！'});
    }
  });
}

