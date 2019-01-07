/*
 * Copyright(c) omk 2016
 * Filename: remove.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Drug = mongoose.model('Drug');

export default function (req) {

  return roleAuthPromise(req, 'delete', 'Drug', (resolve, reject) => {
    const {id} = req.body;
    if (id) {
      Drug.remove({_id: id}, (err) => {
        if (err) {
          reject({msg: '删除失败！'});
        } else {
          resolve({
            code: config.code.success
          });
        }
      });
    } else {
      reject({msg: '缺少参数!'});
    }
  });
}
