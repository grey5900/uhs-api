/**
 * Created by yons on 16/3/12.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
import url from 'url';
const Patient = mongoose.model('Patient');

export default function count(req) {

  return roleAuthPromise(req, 'read', 'Patient', (resolve, reject) => {
    Patient.find({deleted: false})
      .count((err, count) => {
        if (err) {
          console.log(err);
          reject({msg  : '查找失败！'});
        } else {
          resolve({
            code : config.code.success,
            data : count
          });
        }
      });
  });
}
