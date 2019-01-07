/*
 * Copyright(c) omk 2016
 * Filename: remove.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Record = mongoose.model('Record');

export default function remove(req) {

  return roleAuthPromise(req, 'delete', 'Record', (resolve, reject) => {

    const id = req.body.id;
    if (id) {
      Record.findOneAndUpdate({_id: id}, {deleted: true}, (err) => {
        if (err) {
          reject({msg: '删除失败！'});
        } else {
          resolve({code: config.code.success});
        }
      });
    }
  });
}
