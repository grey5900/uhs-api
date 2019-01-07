/*
 * Copyright(c) omk 2016
 * Filename: register_finger.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期二, 28 六月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
import {roleAuthPromise} from '../../lib/auth';
const Patient = mongoose.model('Patient');

export default function(req) {

  return roleAuthPromise(req, 'update', 'Patient', (resolve, reject) => {

    const {patientID, fingerID, fingerStr} = req.body;

    const fingerInfo = {
      finger_id: parseInt(fingerID, 10),
      finger_str: fingerStr
    };
    if (patientID) {
      fingerInfo.update_time = getTime();
      Patient.findOneAndUpdate({_id: patientID}, fingerInfo, (err, patient) => {
        if (err) {
          console.log(err);
          reject({msg: '注册指纹失败！'});
        } else {
          resolve({
            code: config.code.success,
            patient
          });
        }
      });
    } else {
      reject({msg: '缺少参数！'});
    }
  });
}
