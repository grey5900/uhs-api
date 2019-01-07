/*
 * Copyright(c) omk 2016
 * Filename: update_prescription.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : Tuesday, 12 April 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
import {roleAuthPromise} from '../../lib/auth';
const FollowupRecord = mongoose.model('FollowupRecord');
const Prescription = mongoose.model('Prescription');

export default function update_prescription(req) {

  return roleAuthPromise(req, 'update',  'FollowupRecord', (resolve, reject) => {
    const {id, prescription, recordID, doctorID} = req.body;//id是随访单的id
    const {prescription_drug} = prescription;
    const prescriptionDrug = prescription_drug.map((drugInfo, index) => {
      drugInfo.drug = drugInfo.drug._id;
      return drugInfo;
    });

    if (prescription._id) {
      Prescription.findOneAndUpdate({_id: prescription._id}, {
        prescription_drug: prescriptionDrug,
        update_time: getTime()
      }, (error, updatePrescription) => {
        if (error) {
          reject({msg: '更新处方的处方用药失败'});
        } else {
          resolve({code: config.code.success});
        }
      });
    } else {
      const newPrescription = new Prescription({
        doctor: doctorID,
        record: recordID,
        prescription_drug: prescriptionDrug
      });
      if (id) {
        newPrescription.followup = id;
      }
      newPrescription.save((newPrescriptionErr) => {
        if (newPrescriptionErr) {
          reject({msg: '新处方创建失败'});
        }
        else {
          if (id) {
            FollowupRecord.findOneAndUpdate({_id: id}, {
              first_visit: false,
              prescription: newPrescription._id,
              update_time: getTime()
            }, (err, followupDoc) => {
              if (err) {
                reject({msg: '更新随访单失败'});
              } else {
                resolve({code: config.code.success});
              }
            });
          } else {
            resolve({code: config.code.success});
          }
        }
      });
    }
  })
}
