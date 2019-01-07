/*
 * Copyright(c) omk 2016
 * Filename: update.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
const SheetReference = mongoose.model('SheetReference');

export default function update(req) {

  return new Promise((resolve, reject) => {

    const info = req.body;
    const keys = ['name', 'short_name', 'max_value', 'min_value', 'unit'];
    const params = {update_time: getTime()};
    for (var i = 0; i < keys.length; i++) {
      const obj = info[keys[i]];
      if (obj) {
        params[keys[i]] = obj;
      }
    }
    if (info.id) {
      SheetReference.findOneAndUpdate({_id: info.id}, params, (err, doc) => {
        if (!doc || err) {
          reject({msg: '更新失败'});
        } else {
          resolve({code: config.code.success});
        }
      });
    } else {
      reject({msg: '缺少参数（需要化验单参考ID！）'});
    }
  });
}
