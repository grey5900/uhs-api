/*
 * Copyright(c) omk 2016
 * Filename: create.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {judge} from '../message/observers';
import constants from '../message/observers/constants';
import createCureDiary from '../curediary/create';
import {roleAuthPromise as rap} from '../../lib/auth';
const Sheet = mongoose.model('Sheet');
const SheetResult = mongoose.model('SheetResult');
const Diagnosis = mongoose.model('Diagnosis');
const SheetType = mongoose.model('SheetType');

export default function(req, params, ctx) {

  return rap(req, 'create', 'Sheet', (resolve, reject) => {

    const info = req.body;
    const {patient, doctor, record, type} = info;
    const hospital = req.headers['x-hospital'];

    var sheet = new Sheet();
    sheet.record = record;
    sheet.patient = patient;
    sheet.doctor = doctor;
    sheet.hospital = hospital;
    sheet.type = type;
    sheet.report_time = new Date(info.report_time);

    var diagnosis = new Diagnosis();
    diagnosis.description = info.diagnosis;
    diagnosis.patient = info.patient;
    //diagnosis.creator
    diagnosis.save();
    sheet.diagnosis = diagnosis;

    info.results.forEach((looper) => {
      var result = new SheetResult(looper);
      result.deleted = false;
      sheet.results.push(result.id);
      result.save();
    });
    sheet.deleted = false;

    // judge by message engine, generate alert message if sheet has abnormal record
    sheet.save((error) => {
      if (error) {
        console.log(error);
        reject({msg: error.message});
      } else {
        SheetType.findOne({_id: type}, (error, sheetType) => {
          if (error) {
            console.log(error);
          } else {
            judge(constants.sheet, req, {doctor, type: sheetType, sheet, ...ctx});
            createCureDiary(patient, (diary) => {
              diary.events.push({
                target_id: sheet,
                model: 'Sheet',
                content: `<a href="/sheet/${sheet._id}">[今日化验: ${sheetType.name}]</a>`
              });
            });
          }
        });
        resolve({
          code: config.code.success,
          data: sheet
        });
      }
    });

  });
}
