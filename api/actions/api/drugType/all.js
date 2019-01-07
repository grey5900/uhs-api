/**
 * Created by isaac on 16/3/4.
 */
import mongoose from 'mongoose';
import config from '../../config';
const DrugType = mongoose.model('DrugType');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function all(req) {

  return rap(req, 'read', 'DrugType', (resolve, reject) => {

    DrugType.find({deleted: false})
      .exec((err, docs) => {
        if (err) {
          console.log(err);
          reject({msg: '查找失败！'});
        } else {
          resolve({
            code: config.code.success,
            data: docs
          });
        }
      });
  });
}

