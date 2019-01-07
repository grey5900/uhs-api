/*
 * Copyright(c) omk 2016
 * Filename: all.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Medicare = mongoose.model('Medicare');

export default function all(req) {

  return roleAuthPromise(req, 'read', 'Medicare', (resolve, reject) => {

    Medicare.find({deleted: false}).exec((err, docs) => {
      if (err) {
        console.log(err);
        reject({msg: err.message});
      } else {
        resolve({
          code: config.code.success,
          data: docs
        });
      }
    });
  });
}
