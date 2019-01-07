/**
 * Created by isaac on 16/9/8.
 */

import mongoose from 'mongoose';
import {roleAuthPromise as rap} from '../../lib/auth';
import config from '../../config';
const CnrdsQC = mongoose.model('CnrdsQC');

export default function (req) {
  return rap(req, 'read', 'CnrdsQC', (resolve, reject) => {
    const {patient} = req.query;
    CnrdsQC.find({patient})
      .sort({year: 1, quarter: 1})
      .exec((err, docs) => {
        if (err) {
          console.log(err);
          reject({msg: '查找出错！'});
        } else {
          resolve({
            code: config.code.success,
            data: docs
          });
        }
      });
  });
}
