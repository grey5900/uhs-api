/*
 * Copyright(c) omk 2016
 * Filename: get_latest_followup.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期二, 21 六月 2016.
 */

import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Patient = mongoose.model('Patient');
const FollowupRecord = mongoose.model('FollowupRecord');

export default function get_latest_followup(req) {

  return roleAuthPromise(req, 'read', 'Patient', (resolve, reject) => {

    const {patientID} = req.query;

    if (patientID) {
      const date = new Date();
      FollowupRecord.find({patient: patientID, create_time: {$lt: date} })
              .deepPopulate('doctor patient diagnosis order prescription prescription.prescription_drug ' +
                            'prescription.prescription_drug.drug next_appointment order.lab_sheets_event')
              .sort({'create_time': -1})
              .exec((error, followupDoc) => {
                if (error) {
                  reject({msg: '最新化验单查找失败'});
                } else {
                  resolve({
                    code: config.code.success,
                    data: followupDoc[0] || {}
                  });
                }
              });
    } else {
      reject({msg: '缺少参数'});
    }
  });
}
