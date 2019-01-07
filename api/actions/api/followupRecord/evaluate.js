/*
 * Copyright(c) omk 2016
 * Filename: all.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期五, 10 三月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {gather} from '../../lib/util';
import {roleAuthPromise} from '../../lib/auth';

const FollowupRecord = mongoose.model('FollowupRecord');

export default function evaluate(req) {

  return roleAuthPromise(req, 'update', 'FollowupRecord', (resolve, reject) => {

    let {id} = req.body;
    if (id) {
      const params = gather(req.body, ['evaluation']);
        FollowupRecord.findOneAndUpdate({_id: id}, params, (error) => {
          if (error) {
            reject({msg: error.message});
          } else {
            resolve({code: config.code.success});
          }
        });
    } else {
      reject({msg: '缺少参数！'});
    }
  });
}
