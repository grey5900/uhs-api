/*
 * Copyright(c) omk 2016
 * Filename: one.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const Sheet = mongoose.model('Sheet');

export default function one(req) {

  return rap(req, 'read', 'Sheet', (resolve, reject) => {

    Sheet.findOne({_id: req.query.id})
      .deepPopulate('record doctor patient type results results.reference')
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
