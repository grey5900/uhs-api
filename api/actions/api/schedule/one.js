/**
 * Created by isaac on 16/4/30.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const DoctorSchedule = mongoose.model('DoctorSchedule');
const PatientSchedule = mongoose.model('PatientSchedule');

export const deepFields = 'monday_items.machine monday_items.machine.brand_reference monday_items.patient ' +
  ' tuesday_items.machine tuesday_items.machine.brand_reference tuesday_items.patient ' +
  ' wednesday_items.machine wednesday_items.machine.brand_reference wednesday_items.patient ' +
  ' thursday_items.machine thursday_items.machine.brand_reference thursday_items.patient ' +
  ' friday_items.machine friday_items.machine.brand_reference friday_items.patient ' +
  ' saturday_items.machine saturday_items.machine.brand_reference saturday_items.patient';

export default function one(req) {

  const {type, id} = req.query;

  if (type === 'patient') {
    return roleAuthPromise(req, 'read', 'PatientSchedule', (resolve, reject) => {
      PatientSchedule.findOne({_id: id})
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
      DoctorSchedule.findOne({_id: id})
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