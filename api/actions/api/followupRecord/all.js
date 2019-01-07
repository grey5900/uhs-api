/*
 * Copyright(c) omk 2016
 * Filename: all.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期五, 10 三月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const FollowupRecord = mongoose.model('FollowupRecord');

export default function all(req) {

  return roleAuthPromise(req, 'read', 'FollowupRecord', (resolve, reject) => {
    let skip = parseInt(req.query.skip);
    let limit = parseInt(req.query.limit);
    let {patientID} = req.query;
    if (!skip) {
      skip = 0;
    }
    if (!limit) {
      limit = 20;
    }
    FollowupRecord.count({patient: patientID, deleted: false}, (error, count) => {
      FollowupRecord.find({patient: patientID, deleted: false})
                    .select('-__v')
                    .populate('creator next_appointment patient')
                    .skip(skip)
                    .limit(limit)
                    .exec((err, docs) => {
                      if (err || !docs) {
                        console.log(err);
                        reject({msg  : '查找失败！'});
                      } else {
                        resolve({
                          code : config.code.success,
                          data : {
                            total: count,
                            patientFollowups: docs
                          }
                        });
                      }
                    });
    });
  });
}
