/*
 * Copyright(c) omk 2016
 * Filename: all.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const DiseaseRecord = mongoose.model('DiseaseRecord');

export default function all(req) {

  return rap(req, 'read', 'DiseaseRecord', (resolve, reject) => {
    console.log(req.query);
    const {patient} = req.query;
    DiseaseRecord.find({patient, deleted: false})
      .populate('diagnosis')
      .exec((err, docs) => {
        if (err) {
          console.log(err);
          reject({msg: '查找失败！'});
        } else {
          resolve({
            code: config.code.success,
            data: docs
          });
        }
      });
  });
}
