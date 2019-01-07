/*
 * Copyright(c) omk 2016
 * Filename: update.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
import {roleAuthPromise} from '../../lib/auth';
const Record = mongoose.model('Record');

export default function update(req) {

  return roleAuthPromise(req, 'update', 'Record', (resolve, reject) => {

    const {id, args} = req.body;
    args.update_time = getTime();
    Record.findOneAndUpdate({_id: id}, args, (err) => {
      if (err) {
        reject({msg: '更新失败'});
      } else {
        resolve({code: config.code.success});
      }
    });
  });
}
