/**
 * Created by yang on 16/7/15.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getCurrentQueue} from '../../../kue';
import {kJobMachinePreflush} from '../../../kue/constants';
import {getTime} from '../../lib/util';
import {roleAuthPromise} from '../../lib/auth';
const DialysisMachine = mongoose.model('DialysisMachine');

export default function(req) {
  return roleAuthPromise(req, 'update', 'DialysisMachine', (resolve, reject) => {
    const {id, preflush} = req.body;
    if (id) {
      DialysisMachine.findOneAndUpdate({_id: id}, {preflush, update_time: getTime()}, (error) => {
        if (error) {
          console.log(error);
          reject({msg: error.message});
        } else {
          if (preflush === 1) {
            DialysisMachine.findOne({_id: id})
              .populate('brand_reference')
              .exec((error, machine) => {
                if (error) {
                  console.log(error);
                  reject({msg: error.message});
                } else {
                  const {user} = req.session;
                  let {ready_time} = machine.brand_reference;
                  ready_time = parseInt(ready_time, 10) * 60 * 1000;
                  getCurrentQueue((queue) => {
                    console.log('create job:', kJobMachinePreflush, id, ready_time, user._id, resolve);
                    queue.create(kJobMachinePreflush, {machine: id, creator: user._id})
                      .delay(ready_time)
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
