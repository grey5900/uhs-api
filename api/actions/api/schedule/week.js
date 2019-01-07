/**
 * Created by isaac on 16/5/1.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const DoctorSchedule = mongoose.model('DoctorSchedule');
const PatientSchedule = mongoose.model('PatientSchedule');
import {deepFields} from './one';

export default function(req) {
  const {type, week, userType} = req.query;
  const hospital = req.headers['x-hospital'];
  if (type === 'patient') {
    return roleAuthPromise(req, 'read', 'PatientSchedule', (resolve, reject) => {
      var rules = {deleted: false, schedule_week: week, hospital};
      PatientSchedule.findOne(rules)
        .deepPopulate(deepFields)
        .populate('creator monday_items tuesday_items wednesday_items thursday_items friday_items saturday_items')
        .exec((err, doc) => {
          if (err) {
            console.log(err);
            reject({msg: '查找失败！'});
          } else {
            resolve({
              code: config.code.success,
              data: doc
            });
          }
        });
    });
  } else {
    return roleAuthPromise(req, 'read', 'DoctorSchedule', (resolve, reject) => {
      var rules = {deleted: false, is_template: false, schedule_week: week, hospital, type: userType};
      DoctorSchedule.findOne(rules)
        .deepPopulate('creator items items.doctor')
        .exec((err, doc) => {
          if (err) {
            console.log(err);
            reject({msg: '查找失败！'});
          } else {
            resolve({
              code: config.code.success,
              data: doc
            });
          }
        });
    });
  }
}
