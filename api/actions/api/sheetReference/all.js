/*
 * Copyright(c) omk 2016
 * Filename: all.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
const SheetReference = mongoose.model('SheetReference');

export default function all(req) {

  return new Promise((resolve, reject) => {

    SheetReference.find({deleted: false})
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
