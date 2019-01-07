import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
const AllergyDiagnosis = mongoose.model('AllergyDiagnosis');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function update(req) {

  return rap(req, 'update', 'AllergyDiagnosis', (resolve, reject) => {

    const id = req.body._id;
    if (id) {
      const args = {...req.body};
      args.update_time = getTime();
      delete args.id;
      AllergyDiagnosis.findOneAndUpdate({_id: id}, args, (err, doc) => {
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
