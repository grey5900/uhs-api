/*
 * Copyright(c) omk 2016
 * Filename: prescription.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Record = mongoose.model('Record');

export default function prescription(req) {

  return roleAuthPromise(req, 'update', 'Record', (resolve, reject) => {

    const info         = req.body;
    const newPrescription = new Prescription();
    newPrescription.prescription_id = info.prescription_id;
    newPrescription.record = info.record;
    newPrescription.date = info.date;
    newPrescription.doctor = info.doctor;

    newPrescription.save((error) => {
      if (error) {
        console.log(error.message);
        reject({msg   : '添加失败！'});
      } else {
        Record.findOneAndUpdate({_id: info.record},
          {"$push": {prescription: newPrescription._id}},
          {new: true}, (err, doc) => {
          if (!err) {
            resolve({
              code : config.code.success,
              data : doc,
              prescription: newPrescription
            });
          } else {
            reject({msg  : '添加处方到病历失败'});
          }
        });
      }
    });
  });
}
