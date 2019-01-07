/**
 * Created by isaac on 16/6/30.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
import {roleAuthPromise} from '../../lib/auth';
const DialysisMachine = mongoose.model('DialysisMachine');

export default function (req) {

  return roleAuthPromise(req, 'update', 'DialysisMachine', (resolve, reject) => {
    const {id, args} = req.body;
    if (id) {
      DialysisMachine.findById(id, (error, doc) => {
        if (error) {
          console.log(error);
          reject({msg: error.message});
        } else {
          doc.history_info.push(args);
          doc.update_time = getTime();
          doc.save((error) => {
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
