/**
 * Created by yons on 16/3/30.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {judge} from '../message/observers';
import constants from '../message/observers/constants';
import {deepFields} from './one';
import {getTime} from '../../lib/util';
import {roleAuthPromise} from '../../lib/auth';
const DoctorSchedule = mongoose.model('DoctorSchedule');
const DoctorScheduleItem = mongoose.model('DoctorScheduleItem');
const PatientSchedule = mongoose.model('PatientSchedule');
const PatientScheduleItem = mongoose.model('PatientScheduleItem');

function hasScheduleItem(array, target, field) {
  let result = null;
  if (typeof target !== 'string') {
    target = target.toString();
  }
  for (var idx = 0; idx < array.length; ++idx) {
    let obj = array[idx];
    var str = obj[field];
    if (typeof str !== 'string') {
      str = str.toString();
    }
    if (str === target) {
      result = obj;
      break;
    }
  }
  return result;
}

const indexToKey = [
  'monday_items',
  'tuesday_items',
  'wednesday_items',
  'thursday_items',
  'friday_items',
  'saturday_items'
];

function mergeItems(targetItems, sourceItems) {
  const toRemove = [];
  const toAdd = [];
  const toUpdate = [];
  targetItems.forEach((item) => {
    var found = hasScheduleItem(sourceItems, item.patient, 'patient');
    if (found) {
      //need to update the `item`
      toUpdate.push(item.id);
      PatientScheduleItem.update({_id: item.id}, found);
    } else {
      item.remove();
      toRemove.push(item.id);
    }
  });
  sourceItems.forEach((info) => {
    var found = hasScheduleItem(targetItems, info.patient, 'patient');
    if (!found) {
      let item = new PatientScheduleItem(info);
      item.deleted = false;
      item.save();
      toAdd.push(item.id);
    }
  });
  return toUpdate.concat(toAdd);
}

export default function update(req, params, ctx) {
  const {type, args} = req.body;
  if (type === 'patient') {
    return roleAuthPromise(req, 'update', 'PatientSchedule', (resolve, reject) => {
      PatientSchedule.findOne({_id: args.id})
        .deepPopulate(deepFields)
        .populate('creator monday_items tuesday_items wednesday_items thursday_items friday_items saturday_items')
        .exec((err, doc) => {
          if (err) {
            console.log(err);
            reject({msg: '查找失败！'});
          } else {
            if (doc) {
              indexToKey.forEach((key) => {
                doc[key] = mergeItems(doc[key], args[key]);
              });
              doc.update_time = getTime();
              doc.save((error) => {
                if (error) {
                  console.log(error);
                  reject({msg: error.msg});
                } else {
                  judge(constants.dialysisSchedule, req, {schedule: doc, ...ctx});
                  resolve({code: config.code.success});
                }
              });
            } else {
              resolve({code: config.code.success});
            }
          }
        });
    });
  } else {
    return roleAuthPromise(req, 'update', 'DoctorSchedule', (resolve, reject) => {
      DoctorSchedule.findOne({_id: args.id})
        .deepPopulate('items.doctor')
        .exec((err, doc) => {
          if (err) {
            console.log(err);
            reject({msg: '查找失败！'});
          } else {
            if (doc) {
              const toRemove = [];
              const toAdd = [];
              const toUpdate = [];
              doc.items.forEach((item) => {
                var found = hasScheduleItem(args.items, item.doctor, 'doctor');
                if (found) {
                  //need to update the `item`
                  toUpdate.push(item.id);
                  DoctorScheduleItem.update(found);
                } else {
                  item.remove();
                  toRemove.push(item.id);
                }
              });
              args.items.forEach((info) => {
                var found = hasScheduleItem(doc.items, info.doctor, 'doctor');
                if (!found) {
                  let item = new DoctorScheduleItem(info);
                  item.deleted = false;
                  item.save();
                  toAdd.push(item.id);
                }
              });
              doc.items = toUpdate.concat(toAdd);
              doc.update_time = getTime();
              doc.save((error) => {
                if (error) {
                  console.log(error);
                  reject({msg: error.msg});
                } else {
                  judge(constants.doctorSchedule, req, {schedule: doc, ...ctx});
                  resolve({code: config.code.success});
                }
              });
            } else {
              resolve({code: config.code.success});
            }
          }
        });
    });
  }
}
