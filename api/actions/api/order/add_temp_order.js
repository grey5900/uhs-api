/**
 * Created by isaac on 16/7/10.
 */
import mongoose from 'mongoose';
import config from '../../config';
import createCureDiary from '../curediary/create';
import {roleAuthPromise} from '../../lib/auth';
const Order = mongoose.model('Order');
const Patient = mongoose.model('Patient');
const Doctor = mongoose.model('Doctor');
const FollowupRecord = mongoose.model('FollowupRecord');
const DialysisItem = mongoose.model('DialysisItem');

export default function (req, parmas, ctx) {
  return roleAuthPromise(req, 'create', 'Order', (resolve, reject) => {
    const {patient, doctor, items, followupID, dialysisID} = req.body;
    if (patient && doctor) {
      Patient.findOne({_id: patient})
        .exec((error, patientDoc) => {
          if (error) {
            console.log(error);
            reject({msg: error.message});
          } else if (patientDoc) {

            Doctor.findOne({_id: doctor})
              .exec((error, doctorDoc) => {
                if (error) {
                  console.log(error);
                  reject({msg: error.message});
                } else if (doctorDoc) {
                  // FIXME
                  const hisItems = [];
                  // not in his
                  const otherItems = [];
                  items.forEach((iLooper) => {
                    const {c_id} = iLooper;
                    if (c_id) {
                      hisItems.push(iLooper);
                    } else {
                      otherItems.push(iLooper);
                    }
                  });
                  const callback = () => {
                    const newOrder = new Order();
                    newOrder.record = patientDoc.record;
                    newOrder.doctor = doctor;
                    newOrder.type = 'temp';
                    hisItems.forEach((iLooper) => {
                      newOrder.temp_order.push({
                        amount: iLooper.c_amount,
                        treat_plan_id: iLooper.treat_plan_id,
                        execute_time: iLooper.execute_time,
                        content: iLooper.content,
                        start_time: iLooper.start_time
                      });
                    });
                    otherItems.forEach((iLooper) => {
                      newOrder.temp_order.push({
                        execute_time: iLooper.execute_time,
                        content: iLooper.content,
                        start_time: iLooper.start_time
                      });
                    });
                    newOrder.save((error) => {
                      console.log('save temp order', error);
                    });
                    if (followupID) {
                      FollowupRecord.findOneAndUpdate({_id: followupID}, {order: newOrder.id}, (error) => {
                        console.log(error);
                      });
                    }
                    if (dialysisID) {
                      DialysisItem.findOneAndUpdate({_id: dialysisID}, {temp_order: newOrder.id}, (error) => {
                        console.log(error);
                      });
                    }
                    createCureDiary(patient, (diary) => {
                      diary.events.push({
                        target_id: newOrder.id,
                        model: 'Order',
                        content: `<a href="/patient/${patient}/10">[今日医嘱]</a>`
                      });
                    });
                    resolve({code: config.code.success});
                  };
                  if (hisItems.length > 0) {
                    const {his} = ctx;
                    his.saveOrder(patientDoc.yh_his.yyid, doctorDoc.yh_doctor_id,
                      patientDoc.yh_his.jzid, patientDoc.yh_his.brid, hisItems)
                      .then((response) => {
                          console.log(response);
                          callback();
                        },
                        (error) => {
                          console.log('保存医嘱失败!');
                          reject(error);
                        });
                  } else {
                    callback();
                  }
                } else {
                  reject({msg: '医生不存在!'});
                }
              });
          } else {
            reject({msg: '患者不存在!'});
          }
        });
    } else {
      reject({msg: '缺少参数!'});
    }
  });
}
