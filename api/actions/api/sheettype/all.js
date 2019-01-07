/**
 * Created by isaac on 16/4/13.
 */
import mongoose from 'mongoose';
import config from '../../config';
const SheetType = mongoose.model('SheetType');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function all(req) {

  return rap(req, 'read', 'SheetType', (resolve, reject) => {

    SheetType.find({deleted: false})
      .populate('references')
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
