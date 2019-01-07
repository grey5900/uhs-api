import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const KidneyBasic = mongoose.model('KidneyBasic');

export default function one(req) {
  return rap(req, 'read', 'KidneyBasic', (resolve, reject) => {
    const {patientID} = req.query;
    if (patientID) {
      KidneyBasic.findOne({patient: patientID})
        .select('-__v')
      .populate('patient')
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
