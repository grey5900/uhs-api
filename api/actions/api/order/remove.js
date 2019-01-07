/*
 * Copyright(c) omk 2016
 * Filename: remove.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Order = mongoose.model('Order');

export default function remove(req) {

  return roleAuthPromise(req, 'delete', 'Order', (resolve, reject) => {

    const {id} = req.body;
    if (id) {
      Order.findOneAndRemove({_id: id}, (err) => {
        if (err) {
          reject({msg: '删除失败！'});
        } else {
          resolve({code: config.code.success});
        }
      });
    }
  });
}
