/*
 * Copyright(c) omk 2016
 * Filename: remove.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
const SheetReference = mongoose.model('SheetReference');

export default function remove(req) {

  return new Promise((resolve, reject) => {

    const info = req.body;
    if (info.id) {
      SheetReference.findOneAndUpdate({_id: info.id}, {deleted: true}, (err, doc) => {
        if (err) {
          reject({msg: '删除失败！'});
        } else {
          resolve({code: config.code.success});
        }
      });
    }
  });
}
