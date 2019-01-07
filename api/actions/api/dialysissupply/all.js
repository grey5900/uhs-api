/*
 * Copyright(c) omk 2016
 * Filename: all.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期二,  5 七月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
const DialysisSupply = mongoose.model('DialysisSupply');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function all(req) {

  return rap(req, 'read', 'DialysisSupply', (resolve, reject) => {

    DialysisSupply.find({deleted: false})
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
