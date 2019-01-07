/*
 * Copyright(c) omk 2016
 * Filename: upsertQC.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期三,  7 九月 2016.
 */

import mongoose from 'mongoose';
import config from '../../config';
import '../../models/CnrdsQC';
const CnrdsQC = mongoose.model('CnrdsQC');
import moment from 'moment';

export default function upsertQC(date, obj) {
  // console.log('upsertQC', obj);
  return new Promise((resolve, reject) => {
    const year = moment(date).year();
    const quarter = moment(date).quarter();
    const {patient} = obj;
    obj.year = year;
    obj.quarter = quarter;

    CnrdsQC.findOneAndUpdate({patient, year, quarter}, {$set: obj}, {upsert: true}, (err) => {
      if (err) {
        reject({msg: 'upsert Cnrds失败！'});
      } else {
        resolve({code: config.code.success});
      }
    });
  });
}
