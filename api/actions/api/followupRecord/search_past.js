/*
 * Copyright(c) omk 2016
 * Filename: search_past.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : Wednesday, 13 April 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const FollowupRecord = mongoose.model('FollowupRecord');
const Patient = mongoose.model('Patient');

export default function search_past(req) {

  return roleAuthPromise(req, 'read', 'FollowupRecord', (resolve, reject) => {

    console.log('search api', req.query);
    let {start_date, end_date, real_name, mobile} = req.query;
    if (!end_date) {
      end_date = new Date(); //default: today
    } else {
      end_date = new Date(end_date);
    }
    const args = [
      {deleted: false}];
    if (!start_date) {
      args.push({date: {$lt: end_date}});
    } else {
      start_date= new Date(start_date);
      args.push({date: {$gte: start_date, $lt: end_date}});
    }

    let skip = parseInt(req.query.skip);
    let limit = parseInt(req.query.limit);
    if (!skip) {
      skip = 0;
    }
    if (!limit) {
      limit = 20;
    }

    if (real_name || mobile) {
      const hospital = req.headers["x-hospital"];
      const patientArgs = {deleted: false, hospital};
      if (real_name) {
        patientArgs.real_name = real_name;
      }
      if (mobile) {
        patientArgs.mobile = mobile;
      }
      Patient.findOne(patientArgs)
             .exec((err, doc) => {
               if (!err || doc) {
                 args.push({patient: doc._id});
                 FollowupRecord.count({$and: args}, (err, count) => {
                   FollowupRecord.find({$and: args})
                                 .populate('patient')
                                 .skip(skip)
                                 .limit(limit)
                                 .exec((error, docs) => {
                                   if (error) {
                                     console.log(error);
                                     reject({msg: error.message});
                                   } else {
                                     resolve({
                                       code: config.code.success,
                                       data: {
                                         total: count,
                                         pastFollowups: docs
                                       }
                                     });
                                   }
                                 })
                 })
               }
             });
    } else {
      FollowupRecord.count({$and: args}, (err, count) => {
        FollowupRecord.find({$and: args})
                      .populate('patient')
                      .skip(skip)
                      .limit(limit)
                      .exec((error, docs) => {
                        if (error) {
                          console.log(error);
                          reject({msg: error.message});
                        } else {
                          resolve({
                            code: config.code.success,
                            data: {
                              total: count,
                              pastFollowups: docs
                            }
                          });
                        }
                      })
      })
    }
  });
}
