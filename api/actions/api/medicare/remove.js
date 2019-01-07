/*
 * Copyright(c) omk 2016
 * Filename: remove.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Medicare = mongoose.model('Medicare');

export default function remove(req) {

  return roleAuthPromise(req, 'delete', 'Medicare', (resolve, reject) => {

    const number = req.body.number;
    if (number) {
      Medicare.findOneAndUpdate({number: number}, {deleted: true}, (err, doc) => {
        if (err) {
          reject({msg  : '删除失败！'});
        } else {
          resolve({code : config.code.success});
        }
      });
    }
  });
}
