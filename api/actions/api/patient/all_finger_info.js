/*
 * Copyright(c) omk 2016
 * Filename: all_finger_info.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期二, 28 六月 2016.
 */

import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Patient = mongoose.model('Patient');

export default function(req) {

  return roleAuthPromise(req, 'read', 'Patient', (resolve, reject) => {
    const args = [
      {deleted: false},
      {finger_str: {$ne: null}},
      {finger_id: {$ne: null}}
    ];
    Patient.find({$and: args})
           .deepPopulate('medicare doctor')
           .select('finger_id finger_str real_name mobile gender medicare.number doctor.name')
           .sort({'finger_id': -1})
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
