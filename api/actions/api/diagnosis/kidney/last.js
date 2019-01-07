/**
 * Created by isaac on 16/7/8.
 */
import mongoose from 'mongoose';
import config from '../../../config';
import {getUID} from '../../../lib/util';
import {roleAuthPromise as rap} from '../../../lib/auth';
const KidneyDiagnosis = mongoose.model('KidneyDiagnosis');

export default function last(req) {

  return rap(req, 'read', 'KidneyDiagnosis', (resolve, reject) => {
    const {patient} = req.query;
    KidneyDiagnosis.find({patient, deleted: false, creator: getUID(req)})
      .sort({diagnosis_time: -1})
      .limit(1)
      .exec((err, doc) => {
        if (err) {
          console.log(err);
          reject({msg: '创建失败！'});
        } else {
          const data = doc[0] || {};
          resolve({
            code: config.code.success,
            data
          });
        }
      });
  });
}
