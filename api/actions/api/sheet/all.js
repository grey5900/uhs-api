/*
 * Copyright(c) omk 2016
 * Filename: all.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import moment from 'moment';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const Sheet = mongoose.model('Sheet');

export default function all(req) {

  return rap(req, 'read', 'Sheet', (resolve, reject) => {
    const {patient} = req.query;

    Sheet.find({patient})
      .deepPopulate('record doctor patient type results results.reference')
      .sort({report_time: -1})
      .exec((err, sheets) => {
        if (err) {
          console.log(err);
          reject({msg: '查找失败！'});
        } else {
          resolve({
            code: config.code.success,
            data: sheets
          });
        }
      });
  });
}
