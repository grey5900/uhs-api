/*
 * Copyright(c) omk 2016
 * Filename: all.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期五, 26 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const DialysisItem = mongoose.model('DialysisItem');

export default function count(req) {
  return rap(req, 'read', 'DialysisItem', (resolve, reject) => {
    const id = req.query.id;
    DialysisItem.find({patient: id})
      .exec((err, docs) => {
        if (err || !docs) {
          console.log(err);
          reject({msg: '查找失败！'});
        } else {
          resolve({
            code: config.code.success,
            data: docs.length
          });
        }
      });
  });
}
