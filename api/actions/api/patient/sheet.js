/*
 * Copyright(c) omk 2016
 * Filename: sheet.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期五, 26 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Patient = mongoose.model('Patient');

export default function sheet(req) {

  return roleAuthPromise(req, 'read', 'Patient', (resolve, reject) => {

    const info = req.body;
    const patient = info.patient;
    const doctor = info.doctor;
    const record = info.record;
    const type = info.type;

    const sheet = new Sheet();
    sheet.patient = patient;
    sheet.doctor = doctor;
    sheet.record = record;
    sheet.type = type;

    var results = info.results;
    if (patient && doctor && record && type
      && results && results.length > 0) {

      for (var i = 0; i < results.length; ++i) {
        const rl = results[i];
        const sheetResult = new SheetResult();
        sheetResult.name = rl.name;
        sheetResult.short_name = rl.short_name;
        sheetResult.value = rl.value;
        sheetResult.reference = rl.reference;
        sheetResult.save((error) => {
          if (error) {
            console.log(error);
          }
        });
        sheet.results.push(sheetResult);
      }

      sheet.save((error) => {
        if (error) {
          reject({msg: error.message});
        } else {
          resolve({
            code: config.code.success,
            sheet: sheet.id
          });
        }
      });
    } else {
      reject({msg: '缺少参数!'});
    }
  });
}
