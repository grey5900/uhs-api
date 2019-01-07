/*
 * Copyright(c) omk 2016
 * Filename: all.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
const Prescription = mongoose.model('Prescription');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function all(req) {

  return rap(req, 'read', 'Prescription', (resolve, reject) => {
    const {record} = req.query;
    Prescription.find({record})
      .deepPopulate('prescription_drug prescription_drug.drug doctor')
      .sort({create_time: -1})
      .exec((err, docs) => {
        if (err) {
          console.log(err);
          reject({msg: '查找失败！'});
        } else {
          resolve({
            code: config.code.success,
            data: docs
          });
        }
      });
  });
}
