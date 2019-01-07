/*
 * Copyright(c) omk 2016
 * Filename: create.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Record = mongoose.model('Record');

export default function create(req) {

  return roleAuthPromise(req, 'create', 'Record', (resolve, reject) => {
    const info = {
      ...req.body,
      deleted: false
    };
    const patient = info.patient;
    if (patient) {
      const record = new Record(info);
      record.save((error) => {
        if (error) {
          console.log(error.message);
          reject({msg: '病历创建失败'});
        } else {
          resolve({
            code: config.code.success,
            data: record
          });
        }
      });
    } else {
      reject({msg: '缺少患者信息'});
    }
  });
}
