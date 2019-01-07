/**
 * Created by Grey on 16/9/4.
 */
import mongoose from 'mongoose';
import config from '../../config';
const Role = mongoose.model('Role');

export default function (req) {
  return new Promise((resolve, reject) => {
    Role.find({})
      .sort({create_time: -1})
      .exec((error, docs) => {
        if (error) {
          console.log(error);
          reject({msg: '创建失败'});
        } else {
          resolve({
            code: config.code.success,
            data: docs
          });
        }
      });
  });
}
