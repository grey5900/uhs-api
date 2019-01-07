/*
 * Copyright(c) omk 2016
 * Filename: update.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
import {roleAuthPromise as rap} from '../../lib/auth';
const Sheet = mongoose.model('Sheet');

export default function update(req) {

  return rap(req, 'update', 'Sheet', (resolve, reject) => {

    const info = req.body;
    const id = info.id;
    const keys = ['patient', 'doctor', 'hospital', 'record', 'report_time', 'type'];
    const params = {update_time: getTime()};
    for (var i = 0; i < keys.length; i++) {
      const obj = info[keys[i]];
      if (obj) {
        params[keys[i]] = obj;
      }
    }

    if (id) {
      Sheet.findOneAndUpdate({_id: id}, params, (err, doc) => {
        if (!doc || err) {
          reject({msg: '更新失败'});
        } else {
          resolve({
            code: config.code.success,
            data: doc
          });
        }
      });
    } else {
      reject({msg: '缺少参数（需要病历编号！）'});
    }
  });
}
