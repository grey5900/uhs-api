import mongoose from 'mongoose';
import config from '../../config';
const DialysisSupply = mongoose.model('DialysisSupply');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function one(req) {

  return rap(req, 'read', 'DialysisSupply', (resolve, reject) => {
    const {_id} = req.query;
    if (_id) {
      DialysisSupply.findOne({_id})
        .select('-__v')
        .exec((err, doc) => {
          if (err) {
            reject({msg: '查找失败'});
          } else {
            resolve({
              code: config.code.success,
              data: doc
            });
          }
        });
    }
  });
}
