/*
 * Copyright(c) omk 2016
 * Filename: create.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
const Company = mongoose.model('Company');

export default function create(req) {

  return new Promise((resolve, reject) => {

    const info = req.body;

    info.deleted = false;
    const company = new Company(info);
    company.save((error) => {
      if (error) {
        console.log(error);
        reject({msg: '添加失败！'});
      } else {
        resolve({
          code: config.code.success,
          data: company
        });
      }
    });
  });
}

