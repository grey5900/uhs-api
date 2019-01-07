/*
 * Copyright(c) omk 2016
 * Filename: update_appointment.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : Tuesday, 12 April 2016.
 */

import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
import {roleAuthPromise} from '../../lib/auth';
const FollowupRecord = mongoose.model('FollowupRecord');
const UserEvent = mongoose.model('UserEvent');

export default function update_appointment(req) {

  return roleAuthPromise(req, 'update', 'FollowupRecord', (resolve, reject) => {
    console.log('req', req.body);
    const {id, next_appointment, patientID, doctorID} = req.body;

    //如果随访已经有下次随访预约了就更新这个预约，没有就创建并把id放到随访里。
    if (next_appointment) {
      if (next_appointment._id) {
        UserEvent.findOneAndUpdate({_id: next_appointment._id}, {
          start_time: next_appointment.start_time,
          update_time: getTime()
        }, (err, doc) => {
          if (err) {
            reject({msg: '随访更新预约失败'});
          } else {
            resolve({code: config.code.success});
          }
        });
      } else {
        const newAppointment = new UserEvent();
        newAppointment.type = 'inpatient';
        newAppointment.start_time = next_appointment.start_time;
        newAppointment.patient = patientID;
        newAppointment.doctor = doctorID;
        newAppointment.save((error) => {
          if (error) {
            reject({msg: '预约保存失败'});
          } else {
            FollowupRecord.findOneAndUpdate({_id: id}, {
              first_visit: false,
              next_appointment: newAppointment._id,
              update_time: getTime()
            }, (err, doc) => {
              if (err) {
                reject({msg: '随访更新预约失败'});
              } else {
                resolve({code: config.code.success});
              }
            });
          }
        });
      }
    } else {
      // next_appointment不用更新所以直接成功跳过, dispatch 下一个api
      resolve({code: config.code.success});
    }
  })
}
