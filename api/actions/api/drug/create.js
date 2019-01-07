/*
 * Copyright(c) omk 2016
 * Filename: create.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Drug = mongoose.model('Drug');

export default function (req) {

  return roleAuthPromise(req, 'create', 'Drug', (resolve, reject) => {

    const info = req.body;

    info.deleted = false;
    const drug = new Drug(info);
    drug.save((error) => {
      if (error) {
        console.log(error);
        reject({msg: '添加失败！'});
      } else {
        resolve({
          code: config.code.success,
          drug: drug
        });
      }
    });
  });
}

