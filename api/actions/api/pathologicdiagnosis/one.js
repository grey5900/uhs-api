import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const PathologicDiagnosis = mongoose.model('PathologicDiagnosis');

export default function one(req) {

  return roleAuthPromise(req, 'read', 'PathologicDiagnosis', (resolve, reject) => {
    const {patientID} = req.query;
    if (patientID) {
      PathologicDiagnosis.findOne({patient: patientID})
        .select('-__v')
        .exec((err, doc) => {
          if (err) {
            reject({msg: '查找失败'});
          } else {
            resolve({
              code: config.code.success,
              data: doc || {}
            })
          }
        });
    }
  });
}
