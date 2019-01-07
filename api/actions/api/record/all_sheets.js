/*
 * Copyright(c) omk 2016
 * Filename: all_sheets.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Record = mongoose.model('Record');

export default function all_sheets(req) {

  return roleAuthPromise(req, 'read', 'Record', (resolve, reject) => {

    const record = req.query.record;

    if (record) {
      Record.findOne({_id: record, deleted: false})
        .deepPopulate('sheet sheet.results sheet.type sheet.results.reference')
        .exec((err, doc) => {
          console.log("doc", doc);
          if (!err) {
            resolve({
              code: config.code.success,
              data: doc.sheet
            });
          } else {
            reject({msg: '查找失败'});
          }
        });
    } else {
      reject({msg: 'recordId 为 null'});
    }
  });
}
