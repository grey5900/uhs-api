/**
 * Created by isaac on 16/6/29.
 */
import mongoose from 'mongoose';
import config from '../../config';
const MachineBrand = mongoose.model('MachineBrand');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function one(req) {

  return rap(req, 'read', 'MachineBrand', (resolve, reject) => {

    const {id} = req.query;
    if (id) {
      MachineBrand.findOne({_id: id}, (err, doc) => {
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
    }
  });
}

