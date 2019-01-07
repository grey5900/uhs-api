/*
 * Copyright(c) omk 2016
 * Filename: one.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 5 三月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const DialysisMachine = mongoose.model('DialysisMachine');

export default function (req) {

  return roleAuthPromise(req, 'read', 'DialysisMachine', (resolve, reject) => {
    DialysisMachine.findOne({_id: req.query.id})
      .populate('infectious_disease brand_reference')
      .exec((err, doc) => {
        console.log('doc', doc);
        if (err || !doc) {
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
