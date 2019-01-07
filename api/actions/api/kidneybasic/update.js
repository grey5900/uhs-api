import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
import {roleAuthPromise as rap} from '../../lib/auth';
const KidneyBasic = mongoose.model('KidneyBasic');

export default function update(req) {

  return rap(req, 'update', 'KidneyBasic', (resolve, reject) => {
    const {patientID} = req.body;
    if (patientID) {
      const args = {...req.body};
      args.update_time = getTime();
      KidneyBasic.findOneAndUpdate({patient: patientID}, args, {upsert: true}, (err, doc) => {
        if (err) {
          reject({msg: '操作失败！'});
        } else {
          resolve({code: config.code.success});
        }
      });
    } else {
      reject({msg: '缺少参数!'});
    }
  });
}
