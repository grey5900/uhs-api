/**
 * Created by isaac on 16/7/27.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const DoctorSchedule = mongoose.model('DoctorSchedule');
const PatientSchedule = mongoose.model('PatientSchedule');

export default function(req) {
  const {type, name, schedule_week} = req.query;
  const hospital = req.headers['x-hospital'];
  const args = {deleted: false, is_template: true, name, schedule_week, hospital};

  if (type === 'patient') {

    return roleAuthPromise(req, 'read', 'PatientSchedule', (resolve, reject) => {
      PatientSchedule.find(args)
        .deepPopulate('items.patient items.machine')
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
  } else {

    return roleAuthPromise(req, 'read', 'DoctorSchedule', (resolve, reject) => {
      DoctorSchedule.find(args)
        .deepPopulate('items.doctor')
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
