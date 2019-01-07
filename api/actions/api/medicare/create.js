/*
 * Copyright(c) omk 2016
 * Filename: create.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Medicare = mongoose.model('Medicare');

export default function create(req) {

  return roleAuthPromise(req, 'create', 'Medicare', (resolve, reject) => {
    const info = req.body;
    const {number} = info;

    if (number) {
      Medicare.findOne({number: number}, (err, doc) => {
        if (doc) {
          reject({msg: '该医保已存在！'});
        } else {
          info.deleted = false;
          const medicare = new Medicare(info);
          medicare.save((error) => {
            if (error) {
              console.log(error.message);
              reject({msg: number + '添加失败！'});
            } else {
              resolve({
                code: config.code.success,
                data: medicare
              });
            }
          });
        }
      });
    } else {
      reject({msg: '缺少参数！（需要医保编号）'});
    }
  });
}
