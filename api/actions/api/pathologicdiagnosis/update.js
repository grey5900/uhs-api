import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
import {roleAuthPromise} from '../../lib/auth';
const PathologicDiagnosis = mongoose.model('PathologicDiagnosis');

export default function update(req) {

  return roleAuthPromise(req, 'update', 'PathologicDiagnosis', (resolve, reject) => {

    const id = req.body._id;
    if (id) {
      const args = {...req.body};
      args.update_time = getTime();
      delete args.id;
      PathologicDiagnosis.findOneAndUpdate({_id: id}, args, (err, doc) => {
        if (!doc || err) {
          reject({msg: '更新失败！'});
        } else {
          resolve({code: config.code.success});
        }
      });
    } else {
      reject({msg: '缺少参数!'});
    }
  });
}
