/*
 * Copyright(c) omk 2016
 * Filename: create.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import createCureDiary from '../curediary/create';
const FollowupRecord = mongoose.model('FollowupRecord');
const Prescription = mongoose.model('Prescription');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function create(req) {

  return rap(req, 'create', 'Prescription', (resolve, reject) => {
    const {followupID, prescription, recordID, doctorID} = req.body; //id是随访单的id
    const {prescription_drug} = prescription;
    const prescriptionDrug = prescription_drug.map((drugInfo) => {
      drugInfo.drug = drugInfo.drug._id || drugInfo.drug;
      return drugInfo;
    });
    const newPrescription = new Prescription({doctor: doctorID, record: recordID, prescription_drug: prescriptionDrug});
    newPrescription.save((newPrescriptionErr) => {
      if (newPrescriptionErr) {
        reject({msg: '新处方创建失败'});
      } else {
        const {patient} = prescription;
        createCureDiary(patient, (diary) => {
          diary.events.push({
            target_id: prescription,
            model: 'Prescription',
            content: `<a href="/patient/${patient}/11">[今日处方]</a>`
          });
        });
        if (!followupID) {
          Prescription.populate(newPrescription, {path: 'prescription_drug.drug'}, (populateErr, populateDoc) => {
            if (populateErr) {
              reject({msg: 'populate药品'});
            } else {
              resolve({
                code: config.code.success,
                data: populateDoc
              });
            }
          });
        } else {
          FollowupRecord.findOneAndUpdate({_id: followupID}, {first_visit: false, prescription: newPrescription._id}, (err, followupDoc) => {
            if (err) {
              reject({msg: '更新随访单失败'});
            } else {
              resolve({
                code: config.code.success,
                data: newPrescription
              });
            }
          });
        }
      }
    });
  });
}
