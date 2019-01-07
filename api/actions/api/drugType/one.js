/*
 * Copyright(c) omk 2016
 * Filename: one.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期五, 26 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
const DrugType = mongoose.model('DrugType');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function one(req) {

  return rap(req, 'read', 'DrugType', (resolve, reject) => {

    const name = req.query.name;

    if (name) {
      DrugType.findOne({name})
        .exec((err, doc) => {
          if (err) {
            console.log(err);
            reject({msg: '查找失败！'});
          } else {
            resolve({
              code: config.code.success,
              data: doc
            });
          }
        });
    } else {
      reject({msg: '缺少参数'});
    }
  });
}
