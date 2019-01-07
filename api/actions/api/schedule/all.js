/**
 * Created by yons on 16/3/27.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const DoctorSchedule = mongoose.model('DoctorSchedule');
const PatientSchedule = mongoose.model('PatientSchedule');

export default function all(req) {
  const {type} = req.query;
  const hospital = req.headers['x-hospital'];
  if (type === 'patient') {
    return roleAuthPromise(req, 'read', 'PatientSchedule', (resolve, reject) => {
      var rules = {deleted: false, hospital};
      PatientSchedule.find(rules,
        (err, docs) => {
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
  } else {
    return roleAuthPromise(req, 'read', 'DoctorSchedule', (resolve, reject) => {
      DoctorSchedule.find({deleted: false, hospital, is_template: false})
        .populate('creator items')
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
}
