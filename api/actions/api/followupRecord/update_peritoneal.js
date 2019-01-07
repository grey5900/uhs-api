/*
 * Copyright(c) omk 2016
 * Filename: update_peritoneal.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期日,  1 五月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
import {roleAuthPromise} from '../../lib/auth';
const FollowupRecord = mongoose.model('FollowupRecord');

export default function update_peritoneal(req) {

  return roleAuthPromise(req, 'update', 'FollowupRecord', (resolve, reject) => {

    const {id, followupRecord, peritoneal} = req.body;
    const {type, date} = followupRecord;

    FollowupRecord.findOneAndUpdate({_id: id}, {
      first_visit: false,
      type,
      date,
      peritoneal,
      update_time: getTime()
    }, (err, doc) => {
      if (!err) {
        resolve({code: config.code.success});
      } else {
        reject({msg: '更新失败'});
      }
    });
  });
}
