/**
 * Created by isaac on 2/21/16.
 */
import mongoose from 'mongoose';
import config from '../../config';
import auth from '../../lib/auth';
import {roleAuthPromise as rap} from '../../lib/auth';
const Hospital = mongoose.model('Hospital');
const addRoleFilter = auth.addRoleFilter;

export default function all(req) {

  return rap(req, 'read', 'Hospital', (resolve, reject) => {

    const params = {};
    addRoleFilter(req, params, '_id');
    Hospital.find(params)
      .populate('super_hospital')
      .exec((err, docs) => {

        if (err) {
          reject({
            msg: '查找出错！'
          });
        } else {
          resolve({
            code: config.code.success,
            data: docs
          });
        }
      });
  });
}
