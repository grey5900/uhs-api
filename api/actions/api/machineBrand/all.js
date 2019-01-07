/**
 * Created by Grey on 16/6/23.
 */
import mongoose from 'mongoose';
import config from '../../config';
const MachineBrand = mongoose.model('MachineBrand');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function all(req) {

  return rap(req, 'read', 'MachineBrand', (resolve, reject) => {
    var hospital = req.headers["x-hospital"];
    const {name} = req.query;
    const args = {deleted: false, hospital};
    if (name) {
      args.name = name;
    }
    MachineBrand.find(args)
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
