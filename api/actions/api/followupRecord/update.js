/*
 * Copyright(c) omk 2016
 * Filename: update.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : Monday, 11 April 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
import {roleAuthPromise} from '../../lib/auth';
const FollowupRecord = mongoose.model('FollowupRecord');

export default function update(req) {

  return roleAuthPromise(req, 'update', 'FollowupRecord', (resolve, reject) => {
    console.log('req.body', req.body);
    const {id, symptoms} = req.body;

    FollowupRecord.findOneAndUpdate({_id: id}, {
      first_visit: false,
      symptoms: symptoms,
      update_time: getTime()
    }, (err, doc) => {
      if (err || !doc) {
        reject({msg: '病症更新失败'});
      } else {
        resolve({code: config.code.success});
      }
    });
  });
}
