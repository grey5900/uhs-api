/**
 * Created by isaac on 16/5/6.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const Meta = mongoose.model('Meta');

export default function all(req) {

  return rap(req, 'read', 'Meta', (resolve, reject) => {

    Meta.find({}, (err, docs) => {
      if (err) {
        console.log(err);
        reject({msg: err.message});
      } else {
        resolve({
          code: config.code.success,
          data: docs
        });
      }
    });
  });
}
