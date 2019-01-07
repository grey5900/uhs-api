/*
 * Copyright(c) omk 2016
 * Filename: update.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
const Prescription = mongoose.model('Prescription');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function update(req) {

  return rap(req, 'update', 'Prescription', (resolve, reject) => {

    const {prescription} = req.body;
    const {prescription_drug} = prescription;
    const prescriptionDrug = prescription_drug.map((drugInfo, index) => {
      drugInfo.drug = drugInfo.drug._id || drugInfo.drug;
      return drugInfo;
    });

    Prescription.findOneAndUpdate({_id: prescription._id}, {
      prescription_drug: prescriptionDrug,
      update_time: getTime()
    }, {new: true}, (error, updatePrescription) => {
      if (error) {
        reject({msg: '更新处方的处方用药失败'});
      } else {
        Prescription.populate(updatePrescription, {path: 'prescription_drug.drug'}, (err, populateDoc) => {
          if (err) {
            reject({msg: 'populate 处方开药失败'});
          } else {
            resolve({
              code: config.code.success,
              data: populateDoc
            });
          }
        });
      }
    });
  });
}
