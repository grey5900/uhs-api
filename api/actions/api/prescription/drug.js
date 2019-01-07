/*
 * Copyright(c) omk 2016
 * Filename: drug.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
const Prescription = mongoose.model('Prescription');
const PrescriptionDrug = mongoose.model('PrescriptionDrug');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function drug(req) {

  return rap(req, 'create', 'PrescriptionDrug', (resolve, reject) => {

    const info = req.body;
    const prescriptionDrug = new PrescriptionDrug();
    prescriptionDrug.prescription = info.prescription;
    prescriptionDrug.comment = info.comment;
    if (info.drug) {
      prescriptionDrug.drug = info.drug;
      prescriptionDrug.usage = info.usage;
      prescriptionDrug.amount = info.amount;
    }
    prescriptionDrug.save((error) => {
      if (error) {
        reject({msg: '添加失败！'});
      } else {
        Prescription.findOneAndUpdate({_id: info.prescription},
          {"$push": {prescription_drug: prescriptionDrug._id}},
          {new: true}, (err, doc) => {
            if (!err) {
              doc.deepPopulate('prescription_drug prescription_drug.drug doctor', (err, populatedDoc) => {
                if (!err) {
                  resolve({
                    code: config.code.success,
                    data: doc
                  });
                } else {
                  reject({msg: err.message});
                }
              });
            } else {
              reject({msg: '添加药品到处方失败'});
            }
          });
      }
    });
  });
}
