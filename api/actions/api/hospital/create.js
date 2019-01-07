/**
 * Created by isaac on 2/21/16.
 */
// import auth from '../../lib/auth';
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const Hospital = mongoose.model('Hospital');

export default function create(req) {

  return rap(req, 'create', 'Hospital', (resolve, reject) => {
    const info = {
      ...req.body,
      deleted: false
    };
    const hospital = new Hospital(info);
    hospital.save((error) => {
      if (error) {
        reject({msg: '医院创建失败!'});
      } else {
        resolve({
          code: config.code.success,
          data: hospital
        });
      }
    });
  });
}
