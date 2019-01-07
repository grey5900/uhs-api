/**
 * Created by isaac on 16/4/27.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Drug = mongoose.model('Drug');

export const kPopulateString = 'company';

export default function (req) {

  return roleAuthPromise(req, 'read', 'Drug', (resolve, reject) => {
    const {id} = req.query;
    Drug.findOne({_id: id})
      .populate(kPopulateString)
      .exec((err, doc) => {
        if (err) {
          console.log(err);
          reject({msg: '查找失败！'});
        } else {
          resolve({
            code: config.code.success,
            data: doc
          });
        }
      });
  });
}

