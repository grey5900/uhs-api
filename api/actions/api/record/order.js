/*
 * Copyright(c) omk 2016
 * Filename: order.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Record = mongoose.model('Record');

export default function order(req) {

  return roleAuthPromise(req, 'update', 'Record', (resolve, reject) => {
    const info = req.body;
    const record = info.record;

    if (record) {
      const newOrder     = new Order();
      newOrder.content = info.content;
      newOrder.start_time = info.start_time;
      newOrder.end_time = info.end_time;
      newOrder.record  = record;
      newOrder.type = info.type;
      newOrder.save((error) => {
        if (error) {
          console.log(error.message);
          reject({msg   : '医嘱添加失败！',});
        } else {
          Record.findOneAndUpdate({_id: record}, {"$push" : {order: newOrder._id} }, {new: true}, (err, doc) => {
            if (!err) {
              resolve({
                code : config.code.success,
                data : doc,
                order: newOrder
              });
            } else {
              reject({msg  : '添加到病历失败'});
            }
          });
        }
      });
    } else {
      reject({msg  : '缺少参数！（需要病例信息）'});
    }
  });
}
