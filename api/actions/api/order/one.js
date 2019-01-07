/*
 * Copyright(c) omk 2016
 * Filename: one.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Order = mongoose.model('Order');

export default function one(req) {

  return roleAuthPromise(req, 'read', 'Order', (resolve, reject) => {

    Order.findOne({_id: req.query.id})
      .deepPopulate('record lab_sheets_event drugs.drug_id temp_order temp_order.treat_plan_id')
      .exec((err, doc) => {
        if (err) {
          reject({msg: '查找失败'});
        } else {
          resolve({
            code: config.code.success,
            data: doc
          });
        }
      });
  });
}
