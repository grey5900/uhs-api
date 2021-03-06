/*
 * Copyright(c) omk 2016
 * Filename: one.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import moment from 'moment';
const CureDiary = mongoose.model('CureDiary');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function(req) {

  return rap(req, 'read', 'CureDiary', (resolve, reject) => {
    const {id} = req.query;
    const today = moment().toDate().getTime();
    const nextDay = moment().add(1, 'days').toDate().getTime();
    CureDiary.findOne({create_time: {$gte: today, $lt: nextDay}, patient: id})
      .deepPopulate('patient doctor events.target_id')
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
