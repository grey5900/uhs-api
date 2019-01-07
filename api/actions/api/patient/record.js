/*
 * Copyright(c) omk 2016
 * Filename: record.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期五, 26 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Patient = mongoose.model('Patient');

export default function record(req) {

  return roleAuthPromise(req, 'create', 'Patient', (resolve, reject) => {

    const info = req.body;
    const record = new Record();
    record.patient = info.patient;
    record.doctor = info.doctor;
    record.hospital = info.hospital;
    record.state = info.state;

    record.save((error) => {
      if (error) {
        console.log(error.message);
        reject({msg: '病例创建失败'});
      } else {

        Patient.findOneAndUpdate({_id: info.patient},
          {record: record._id},
          (error) => {
            if (error) {
              reject({msg: '添加患者病历失败'});
            } else {
              resolve({
                code: config.code.success,
                msg: '该患者病历添加成功！'
              });
            }
          });
      }
    });
  });
}
