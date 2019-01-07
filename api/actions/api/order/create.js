/*
 * Copyright(c) omk 2016
 * Filename: create.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import createCureDiary from '../curediary/create';
const Order = mongoose.model('Order');
import {roleAuthPromise} from '../../lib/auth';
export default function (req) {

  return roleAuthPromise(req, 'create', 'Order', (resolve, reject) => {

    const info = {
      ...req.body,
      deleted: false
    };
    const {record} = info;

    if (record) {
      const order = new Order(info);
      order.save((error) => {
        if (error) {
          console.log(error);
          reject({msg: '医嘱添加失败！'});
        } else {
          const {patient} = info;
          createCureDiary(patient, (diary) => {
            diary.events.push({
              target_id: order,
              model: 'Order',
              content: `<a href="/patient/${patient}/10">[今日医嘱]</a>`
            });
          });
          resolve({
            code: config.code.success,
            data: order
          });
        }
      });
    } else {
      reject({msg: '缺少参数！（需要病例信息）'});
    }
  });
}
