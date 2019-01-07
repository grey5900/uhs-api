/**
 * Created by isaac on 16/3/3.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
import {roleAuthPromise} from '../../lib/auth';
import {checkMachineIndexWithCallback} from './create';
const DialysisMachine = mongoose.model('DialysisMachine');

export default function (req) {

  return roleAuthPromise(req, 'update', 'DialysisMachine', (resolve, reject) => {
    const {id, args} = req.body;
    if (id) {
      checkMachineIndexWithCallback(args.index, (docs) => {
        console.log(docs);
        if (docs.length > 0 && docs[0].id !== id) {
          reject({msg: `编号为${args.index}的机器已存在!`});
        } else {
          args.update_time = getTime();
          DialysisMachine.findOneAndUpdate({_id: id}, args, (error) => {
            if (error) {
              console.log(error);
              reject({msg: error.message});
            } else {
              resolve({code: config.code.success});
            }
          });
        }
      });
    } else {
      reject({msg: '缺少参数！'});
    }
  });
}
