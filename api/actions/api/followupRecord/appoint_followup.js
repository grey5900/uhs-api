/*
 * Copyright(c) omk 2016
 * Filename: appoint_followup.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : Thursday, 14 April 2016.
 */

import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const FollowupRecord = mongoose.model('FollowupRecord');
const UserEvent = mongoose.model('UserEvent');

export default function appoint_followup(req) {

  return roleAuthPromise(req, 'create', 'FollowupRecord', (resolve, reject) => {

    console.log('appoint', req.body);
    const {patientID, appointment} = req.body;
    const newAppointment = new UserEvent(appointment);
    newAppointment.patient = patientID;

    newAppointment.save((error) => {
      if (error) {
        reject({msg: '预约失败'});
      } else {
        console.log('save success');
        resolve({code: config.code.success});
      }
    });
  });
}
