/**
 * Created by isaac on 16/7/7.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {judge} from '../message/observers';
import constants from '../message/observers/constants';
import {getCurrentQueue} from '../../../kue';
import {kJobDialysisSample} from '../../../kue/constants';
import {getTime} from '../../lib/util';

import moment from 'moment';
const DialysisItem = mongoose.model('DialysisItem');
const Order = mongoose.model('Order');

function addTaskWithTime(delayMilliseconds, params) {
  getCurrentQueue((queue) => {
    queue
      .create(kJobDialysisSample, params)
      .delay(delayMilliseconds)
      .save();
  });
}

export default function (req, params, ctx) {
  return rap(req, 'read', 'DialysisItem', (resolve, reject) => {

    const {id, status} = req.body;
    judge(constants.dialysis, req, {id, ...ctx});
    const args = {status};
    if (status === 3 || status === 4) {
      // pause or offline
      DialysisItem.findOne({_id: id})
        .populate('schedule')
        .exec((error, doc) => {
          if (error) {
            console.log(error);
            reject({msg: error.message});
          } else {
            doc.status = status;
            doc.duration += moment().diff(doc.last_start_time, 'minutes');
            doc.save((error) => {
              if (error) {
                console.log(error);
                reject({msg: error.message});
              } else {
                resolve({code: config.code.success});
              }
            });
          }
        });
    } else {
      // 上机!
      const anHour = 60 * 60 * 1000;
      const halAnHour = 30 * 60 * 1000;
      let messageCount = 4;
      DialysisItem.findOne({_id: id})
        .deepPopulate('patient')
        .exec((error, doc) => {
          if (error) {
            reject({msg: error.message});
          } else {
            const params = {'dialysisItem': doc, 'longItemOrder': doc.long_term_orde || {}};
            if (doc.long_term_order) {
              Order.findOne({_id: doc.long_term_orde.id})
                .deepPopulate('record lab_sheets_event drugs.drug_id temp_order temp_order.treat_plan_id')
                .exec((err, doc) => {
                  if (err) {
                    console.log(err);
                  } else {
                    messageCount = doc.noHeparin ? 8 : 4;
                    const timeUnit = doc.noHeparin ? halAnHour : anHour;
                    for (let idx = 0; idx < messageCount; ++idx) {
                      addTaskWithTime(idx * timeUnit, params);
                    }
                  }
                });
            }
          }
        });
      const now = new Date();
      if (status === 2) {
        args.last_start_time = now;
      }
      args.update_time = getTime();
      DialysisItem.findOneAndUpdate({_id: id}, args, (error) => {
        if (error) {
          console.log(error);
          reject({msg: error.message});
        } else {
          resolve({code: config.code.success});
        }
      });
    }
  });
}
