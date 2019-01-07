/*
 * Copyright(c) omk 2016
 * Filename: sheet.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Record = mongoose.model('Record');

export default function sheet(req) {

  return roleAuthPromise(req, 'read', 'Record', (resolve, reject) => {

    const info = req.body;
    const record = info.record;

    if (record) {
      const newSheet = new Sheet();
      newSheet.record = record;
      newSheet.patient = info.patient;
      newSheet.type = info.type;
      newSheet.report_time = info.report_time;
      newSheet.hospital = info.hospital;
      newSheet.doctor = info.doctor;

      newSheet.save((error) => {

        if (error) {
          console.log(error.message);
          reject({msg: '化验单创建失败'});
        } else {
          Record.findOneAndUpdate({_id: record},
                                  {"$push": {sheet: newSheet._id}},
                                  {new: true},
                                  (err, doc) => {
                                    if (err) {
                                      console.log(err.message);
                                      reject({msg: '添加化验单到病历失败'});
                                    } else {
                                      Sheet.findOne({_id: newSheet._id})
                                           .populate('type')
                                           .exec((err, sheet) => {
                                             if (!err) {
                                               resolve({
                                                 code: config.code.success,
                                                 sheet: sheet,
                                                 data: doc
                                               });
                                             } else {
                                               reject({msg: err.message});
                                             }
                                           });
                                    }
                                  });
        }
      });
    } else {
      reject({msg: '缺少参数'});
    }
  });
}
