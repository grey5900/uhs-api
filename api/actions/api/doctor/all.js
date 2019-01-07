import mongoose from 'mongoose';
import {roleAuthPromise as rap} from '../../lib/auth';
import config from '../../config';
import url from 'url';
const Doctor = mongoose.model('Doctor');

export default function all(req) {
  return rap(req, 'read', 'Doctor', (resolve, reject) => {
    const parsed_url = url.parse(req.url, true);
    let {hospital} = parsed_url.query;
    if (!hospital) {
      hospital = req.headers["x-hospital"];
    }
    if (hospital) {

      Doctor.find({hospital, deleted: false})
        .select('-__v')
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
    } else {
      reject({msg: '缺少参数!'});
    }
  });
}
