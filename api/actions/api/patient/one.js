/*
 * Copyright(c) omk 2016
 * Filename: one.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期五, 26 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Patient = mongoose.model('Patient');

export default function one(req) {

  return roleAuthPromise(req, 'read', 'Patient', (resolve, reject) => {

    const id = req.query.id;

    if (id) {
      Patient.findOne({_id: id, deleted: false})
        .deepPopulate('hospital medicare record.hospital record.doctor record.order record.prescription ' +
          ' record.prescription.prescription_drug record.prescription.doctor record.prescription.prescription_drug.drug ' +
          ' record.fistula_file1 record.fistula_file2 record.fistula_file3 ' +
          ' record.sheet record.sheet.type record.sheet.results record.sheet.results.reference contact doctor nurse avatar outcome')
        .exec((err, doc) => {
          if (err) {
            console.log(err);
            reject({msg: '查找失败！'});
          } else {
            resolve({
              code: config.code.success,
              data: doc
            });
          }
        });
    } else {
      reject({msg: '缺少参数'});
    }
  });
}
