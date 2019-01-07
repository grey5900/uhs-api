/*
 * Copyright(c) omk 2016
 * Filename: past_followups.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : Tuesday, 12 April 2016.
 */

import mongoose from 'mongoose';
import {addAdminID} from '../../lib/util';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const UserEvent = mongoose.model('UserEvent');

export default function past_followups(req) {

  return roleAuthPromise(req, 'read', 'FollowupRecord', (resolve, reject) => {
    let skip = parseInt(req.query.skip);
    let limit = parseInt(req.query.limit);
    if (!skip) {
      skip = 0;
    }
    if (!limit) {
      limit = 20;
    }
    const today = new Date().setHours(0,0,0,0);
    const args = {start_time: {$lt: today}, type: {$in: ['inpatient', 'home']}, deleted: false};
    addAdminID(req, args);
    UserEvent.count(args, (error, count) => {
      if (error) {
        reject({msg: error.message});
      } else {
        if (count === 0) {
          resolve({
            code: config.code.success,
            data: {
              total: 0,
              pastFollowups: []
            }
          });
        } else {
          UserEvent.find(args)
            .populate('patient doctor')
            .skip(skip)
            .limit(limit)
            .sort({start_time: -1})
            .exec((err, docs) => {
              if (err) {
                reject({msg: '查找失败'});
              } else {
                resolve({
                  code: config.code.success,
                  data: {
                    total: count,
                    pastFollowups: docs
                  }
                })
              }
            });
        }
      }
    });
  });
}
