/**
 * Created by isaac on 16/8/25.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {deepPopulatString} from './one';
import {roleAuthPromise} from '../../lib/auth';
const DialysisPlan = mongoose.model('DialysisPlan');

export default function (req) {

  return roleAuthPromise(req, 'read', 'DialysisPlan', (resolve, reject) => {
    const {patient} = req.query;
    if (patient) {
      DialysisPlan.find({patient})
        .sort({create_time: -1})
        .limit(1)
        .deepPopulate(deepPopulatString)
        .exec((error, doc) => {
          if (error) {
            console.log(error);
            reject({msg: '查找失败!'});
          } else {
            resolve({
              code: config.code.success,
              data: doc[0] || {}
            });
          }
        });
    } else {
      reject({msg: '缺少参数: patient'});
    }
  });
}
