/*
 * Copyright(c) omk 2016
 * Filename: update_order.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : Sunday, 10 April 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
import {roleAuthPromise} from '../../lib/auth';
const FollowupRecord = mongoose.model('FollowupRecord');
const Order = mongoose.model('Order');
const UserEvent = mongoose.model('UserEvent');

export default function update_order(req) {

  return roleAuthPromise(req, 'update', 'FollowupRecord', (resolve, reject) => {
    const {id, order, patientID, recordID} = req.body;
    const {lab_sheets_event} = order;

    //如果随访已经有诊断了就更新这个诊断，没有就创建并把id放到随访里。

    if (order._id) {
      order.update_time = getTime();
      Order.findOneAndUpdate({_id: order._id}, order, (err, doc) => {
        if (!err) {
          lab_sheets_event.forEach((lab_sheet, index) => {
            UserEvent.findOneAndUpdate({_id: lab_sheet._id}, {
              deleted: lab_sheet.deleted,
              update_time: getTime()
            }, (error, labdoc) => {
              if (error) {
                reject({msg: '更新化验单失败'});
              }
              else {
                if (index === lab_sheets_event.length - 1) {
                  resolve({code: config.code.success});
                }
              }
            })
          })
        } else {
          reject({msg: '更新医嘱失败'});
        }
      });
    } else {
      const newOrder = new Order();
      newOrder.content = order.content;
      newOrder.type = 'temp';
      newOrder.record = recordID;
      lab_sheets_event.forEach((lab_sheet, index, lab_sheets_event) => {
        const newUserEvent = new UserEvent();
        newUserEvent.deleted = lab_sheet.deleted;
        newUserEvent.name = lab_sheet.name;
        newUserEvent.type = 'sheet';
        newUserEvent.patient = patientID;
        newUserEvent.save((error) => {
          if (!error) {
            console.log('new user event', newUserEvent, newOrder.lab_sheets_event);
            newOrder.lab_sheets_event.push(newUserEvent._id);
            if (index === lab_sheets_event.length - 1) {
              console.log('save new order', newOrder.lab_sheets_event);
              newOrder.save((error) => {
                if (error) {
                  reject({msg: '医嘱创建失败'});
                }
                else {
                  FollowupRecord.findOneAndUpdate({_id: id}, {
                    first_visit: false,
                    order: newOrder._id,
                    update_time: getTime()
                  }, (err, doc) => {
                    if (err) {
                      reject({msg: '创建医嘱后更新随访单失败'});
                    }
                    else {
                      resolve({code: config.code.success});
                    }
                  });
                }
              });
            }
          } else {
            reject({msg: '医嘱化验单预约失败!'});
          }
        });
      });
    }
  })
}
