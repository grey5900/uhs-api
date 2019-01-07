/*
 * Copyright(c) omk 2016
 * Filename: all.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期五, 26 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {addDoctor} from '../../lib/util';
import {roleAuthPromise} from '../../lib/auth';
const Patient = mongoose.model('Patient');

export default function(req) {

  return roleAuthPromise(req, 'read', 'Patient', (resolve, reject) => {
    const hospital = req.headers["x-hospital"];
    const {type} = req.query;
    const args = {deleted: false, hospital};
    if (type) {
      args.type = type;
    }
    addDoctor(req, args);
    Patient.find(args)
      .select('-__v')
      .populate('medicare hospital record dialysis_machine dialysis_supplies avatar outcome')
      .sort({create_time: -1})
      .exec((err, docs) => {
        if (err || !docs) {
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
