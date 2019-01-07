import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const KidneyBasic = mongoose.model('KidneyBasic');

export default function create(req) {
  return rap(req, 'create', 'KidneyBasic', (resolve, reject) => {
    const info = {
      ...req.body,
      deleted: false
    };
    const kidneyBasic = new KidneyBasic(info);
    kidneyBasic.save((error) => {
      if (error) {
        console.log(error.message);
        reject({msg: '添加失败！'});
      } else {
        resolve({
          code: config.code.success,
          data: kidneyBasic
        });
      }
    });
  });
}
