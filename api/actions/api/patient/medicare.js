/*
 * Copyright(c) omk 2016
 * Filename: medicare.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期五, 26 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Patient = mongoose.model('Patient');
const Medicare = mongoose.model('Medicare');

export default function medicare(req) {

  return roleAuthPromise(req, 'create', 'Patient', (resolve, reject) => {

    const info = req.body;
    const patientID = info.patient;
    const number = info.number;

    if (number) {
      Medicare.findOne({number: number}, (err, doc) => {
        if (doc) {
          reject({msg: '该医保已存在！'});
        } else {
          const medicare = new Medicare();
          medicare.number = number;
          medicare.locality = info.locality;
          medicare.type = info.type;
          medicare.patient = patientID;
          medicare.save((error) => {
            if (error) {
              console.log(error.message);
              reject({msg: number + '添加失败！'});
            } else {
              Patient.findOneAndUpdate({_id: patientID},
                {medicare: medicare._id},
                (error) => {
                  if (error) {
                    reject({msg: error.message});
                  } else {
                    resolve({
                      code: config.code.success,
                      medicare: medicare
                    });
                  }
                });
            }
          });
        }
      });
    } else {
      reject({msg: '缺少参数！（需要医保编号）'});
    }
  });
}
