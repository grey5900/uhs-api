/*
 * Copyright(c) omk 2016
 * Filename: update.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
const Order = mongoose.model('Order');
import {roleAuthPromise} from '../../lib/auth';
export default function (req) {

  return roleAuthPromise(req, 'update', 'Order', (resolve, reject) => {

    const {id, ...other} = req.body;
    delete other._id;
    if (id) {
      other.update_time = getTime();
      Order.findOneAndUpdate({_id: id}, other, (err, doc) => {
        if (err) {
          console.log(err);
          reject({msg: '更新失败!'});
        } else if (!doc) {
          reject({msg: '医嘱不存在!'});
        } else {
          resolve({
            code: config.code.success,
            data: doc
          });
        }
      });
    } else {
      reject({msg: '缺少参数（需要医嘱编号！）'});
    }
  });
}
