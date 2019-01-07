/*
 * Copyright(c) omk 2016
 * Filename: search_patient.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : Wednesday, 13 April 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import url from 'url';
import generateDateDuration from '../../utils/searchDate';
import {roleAuthPromise} from '../../lib/auth';
const UserEvent = mongoose.model('UserEvent');

export default function search_patient(req) {

  return roleAuthPromise(req, 'read', 'FollowupRecord', (resolve, reject) => {
    console.log('search', req.url);
    const obj = url.parse(req.url, true);
    const {search, patient} = obj.query;
    let skip = parseInt(obj.query.skip);
    let limit = parseInt(obj.query.limit);
    if (!skip) {
      skip = 0;
    }
    if (!limit) {
      limit = 20;
    }
    if (search) {
      const dateDuration = generateDateDuration(search);
      const {date, nextDate} = dateDuration;
      const args = {
        $and: [
          {deleted: false},
          {patient},
          {type: {$in: ['inpatient', 'home']}},
          {start_time: {$gte: date, $lt: nextDate}}
        ]
      };
      UserEvent.count(args, (error, count) => {
        if (error) {
          reject({msg: error.message});
        } else {
          if (count === 0) {
            resolve({
              code: config.code.success,
              data: {
                total: 0,
                patientFollowups: []
              }
            });
          } else {
            UserEvent.find(args)
                          .select('-__v')
                          .populate('patient doctor')
                          .skip(skip)
                          .limit(limit)
                          .exec((err, docs) => {
                            if (err || !docs) {
                              console.log(err);
                              reject({msg: '查找失败！'});
                            } else {
                              resolve({
                                code: config.code.success,
                                data: {
                                  total: count,
                                  patientFollowups: docs
                                }
                              });
                            }
                          });
          }
        }
      });
    } else {
      reject({msg: '缺少参数!'});
    }
  });
}
