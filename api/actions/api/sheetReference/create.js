/*
 * Copyright(c) omk 2016
 * Filename: create.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
const SheetReference = mongoose.model('SheetReference');

export default function create(req) {

  return new Promise((resolve, reject) => {

    const info = req.body;
    const sheetReference = new SheetReference(info);
    sheetReference.deleted = false;
    sheetReference.save((error) => {
      if (error) {
        reject({msg: error.message});
      } else {
        resolve({
          code: config.code.success,
          data: sheetReference
        });
      }
    });
  });
}
