import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const Doctor = mongoose.model('Doctor');

export default function one(req) {
  return rap(req, 'delete', 'Doctor', (resolve, reject) => {
    const {id} = req.body;
    if (id) {
      Doctor.findOneAndUpdate({_id: id}, {deleted: true},
        (err) => {
          if (err) {
            reject({msg: '删除失败！'});
          } else {
            resolve({
              code: config.code.success,
              msg: '删除成功！'
            });
          }
        });
    }
  });
}
