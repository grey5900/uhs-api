/*
 * Copyright(c) omk 2016
 * Filename: sign_by_finger.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期二, 28 六月 2016.
 */

import mongoose from 'mongoose';
import config from '../../config';
import moment from 'moment';
import {createDialysis} from './create';
import {roleAuthPromise as rap} from '../../lib/auth';

const DialysisItem = mongoose.model('DialysisItem');
const CureDiary = mongoose.model('CureDiary');
const Patient = mongoose.model('Patient');

export default function (req) {
  return rap(req, 'read', 'DialysisItem', (resolve, reject) => {

    const info = {
      ...req.body,
      deleted: false
    };
    const today = moment().format('YYYY-M-DD');
    const todayNext = moment().add(1, 'days').format('YYYY-M-DD');
    const startDay = new Date(today);
    const endDay = new Date(todayNext);
    const {fingerID} = info;
    Patient.findOne({finger_id: parseInt(fingerID, 10)})
      .select('finger_id finger_str real_name mobile gender medicare doctor avatar')
      .exec((patientErr, patientDoc) => {
        if (patientErr) {
          reject({msg: '该指纹ID没有患者'});
        } else {
          const patient = patientDoc._id;
          const args = [
            {patient},
            {create_time: {$gte: startDay, $lt: endDay}}
          ];
          DialysisItem.findOne({$and: args}, (err, doc) => {
            if (doc) {
              reject({msg: '已经签到'});
            } else {
              info.patient = patient;
              console.log('sign patient by finger', info);
              createDialysis(req, info, resolve, reject);
            }
          });
        }
      });
  });
}
