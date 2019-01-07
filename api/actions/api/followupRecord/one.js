/*
 * Copyright(c) omk 2016
 * Filename: one.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : Friday,  8 April 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const FollowupRecord = mongoose.model('FollowupRecord');

export default function one(req) {

  return roleAuthPromise(req, 'read', 'FollowupRecord', (resolve, reject) => {
    const id = req.query.id;

    if (id) {
      FollowupRecord.findOne({_id: id, deleted: false})
                    .deepPopulate('patient diagnosis order prescription prescription.prescription_drug ' +
                                  'prescription.prescription_drug.drug next_appointment order.temp_order order.temp_order.treat_plan_id')
                    .populate('doctor')
                    .exec((err, doc) => {
                      if (err) {
                        reject({msg: '查找失败'});
                      } else {
                        console.log('followup doc', doc);
                        const options = {
                          path: 'order.lab_sheets_event',
                          model: 'UserEvent'
                        };
                        FollowupRecord.populate(doc, options, (error, followupDoc) => {
                          if (error) {
                            reject({msg: 'populate fail'});
                          } else {
                            resolve({
                              code: config.code.success,
                              data: followupDoc
                            });
                          }
                        })
                      }
                    });
    } else {
      reject({msg: '缺少参数'});
    }
  });
}
