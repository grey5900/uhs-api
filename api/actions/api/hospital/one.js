/**
 * Created by isaac on 2/21/16.
 */
import mongoose from 'mongoose';
import config from '../../config';
import url from 'url';
import {roleAuthPromise as rap} from '../../lib/auth';
const Hospital = mongoose.model('Hospital');

export default function one(req) {

  return rap(req, 'read', 'Hospital', (resolve, reject) => {
    const parsed_url = url.parse(req.url, true);
    const id = parsed_url.query.id;

    if (id) {
      Hospital.find({_id: id},
        (err, doc) => {
          if (err || !doc) {
            reject({msg: '查找失败'});
          } else {
            resolve({
              code: config.code.success,
              data: doc
            });
          }
        });
    } else {
      reject({msg: '缺少参数!'});
    }
  });
}
