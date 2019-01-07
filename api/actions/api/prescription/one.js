/*
 * Copyright(c) omk 2016
 * Filename: one.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
const Prescription = mongoose.model('Prescription');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function one(req) {

  return rap(req, 'read', 'Prescription', (resolve, reject) => {

    const {id} = req.query;
    Prescription.findOne({_id: id, deleted: false})
      .deepPopulate('prescription_drug.drug doctor')
      .exec((err, doc) => {
        if (err) {
          reject({msg: '查找失败'});
        } else {
          resolve({
            code: config.code.success,
            data: doc
          });
        }
      });
  });
}
