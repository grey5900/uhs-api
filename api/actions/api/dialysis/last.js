/**
 * Created by isaac on 16/7/9.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const DialysisItem = mongoose.model('DialysisItem');
import {deepPopulate} from './one';

export default function(req) {
  return rap(req, 'read', 'DialysisItem', (resolve, reject) => {
    const {patient} = req.query;

    if (patient) {
      DialysisItem.find({patient, deleted: false})
        .sort({create_time: -1})
        .limit(1)
        .deepPopulate(deepPopulate)
        .exec((err, docs) => {
          if (err) {
            console.log(err);
            reject({msg: '查找失败！'});
          } else {
            const data = docs[0] || {};
            resolve({
              code: config.code.success,
              data
            });
          }
        });
    } else {
      reject({msg: '缺少参数'});
    }
  });
}
