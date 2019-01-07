/**
 * Created by isaac on 2/21/16.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
import {roleAuthPromise as rap} from '../../lib/auth';
const Hospital = mongoose.model('Hospital');

export default function update(req) {

  return rap(req, 'update', 'Hospital', (resolve, reject) => {

    const info = req.body;
    const keys = ['name', 'province', 'city', 'area', 'address'];
    const params = {update_time: getTime()};
    for (var i = 0; i < keys.length; ++i) {
      const obj = info[keys[i]];
      if (typeof obj !== 'undefined') {
        params[keys[i]] = obj;
      }
    }

    if (info.super_hospital) {
      hospital.super_hospital = info.super_hospital;
    }

    const hospital_id = info.id;
    Hospital.findOneAndUpdate({_id: hospital_id}, params,
      (error, doc) => {
        if (error || !doc) {
          reject({msg: '更新失败!'});
        } else {
          resolve({code: config.code.success});
        }
      });
  });
}
