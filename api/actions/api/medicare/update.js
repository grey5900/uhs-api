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
const Medicare = mongoose.model('Medicare');

export default function update(req) {

  return roleAuthPromise(req, 'update', 'Medicare', (resolve, reject) => {

    const {id, args} = req.body;
    if (id) {
      args.update_time = getTime();
      Medicare.findOneAndUpdate({_id: id}, args, (err) => {
        if (!doc || err) {
          reject({msg: '更新失败！'});
        } else {
          resolve({code: config.code.success});
        }
      });
    } else {
      reject({msg: '缺少参数!'});
    }
  });
}
