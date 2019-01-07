/**
 * Created by yons on 16/3/15.
 */
import mongoose from 'mongoose';
import config from '../../config';
import url from 'url';
import {roleAuthPromise as rap} from '../../lib/auth';
const DiagnosisType = mongoose.model('DiagnosisType');

export default function one(req) {

  return rap(req, 'read', 'DiagnosisType', (resolve, reject) => {
    const obj = url.parse(req.url, true);
    const {name} = obj.query;
    DiagnosisType.findOne({name, deleted: false})
      .select('-__v')
      .populate('references')
      .exec((error, doc) => {
      if (error) {
        reject({msg: error.message});
      } else {
        resolve({
          code: config.code.success,
          data: doc
        })
      }
    });
  });
}
