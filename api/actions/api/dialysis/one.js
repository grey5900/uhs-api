/*
 * Copyright(c) omk 2016
 * Filename: one.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期五, 26 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const DialysisItem = mongoose.model('DialysisItem');

export const deepPopulate = 'patient.record patient.record.fistula_file1 patient.record.fistula_file2 patient.record.fistula_file3' +
  ' long_term_order.drugs.drug_id ' +
  ' drugs.drug ' +
  ' schedule.machine schedule.machine.brand_reference ' +
  ' machineInfo.dialyser_type machineInfo.old_dialyser_type machineInfo.new_dialyser temp_order.temp_order temp_order.temp_order.treat_plan_id' +
  ' creator.doctor';

export default function one(req) {
  return rap(req, 'read', 'DialysisItem', (resolve, reject) => {
    const id = req.query.id;

    if (id) {
      DialysisItem.findOne({_id: id, deleted: false})
        .deepPopulate(deepPopulate)
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
