/*
 * Copyright(c) omk 2016
 * Filename: all.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Order = mongoose.model('Order');

export const deepPopulate = 'doctor drugs.drug_id dialysis_order.drug dialysis_order.machine dialysis_order.supply ' +
  'dialysis_order.erythropoietin dialysis_order.erythropoietin.treat_plan ' +
  'dialysis_order.l_carnitine dialysis_order.l_carnitine.treat_plan ' +
  'dialysis_order.folic_acid ' +
  'dialysis_order.sheng_xue_ning dialysis_order.iron_saccharate.treat_plan dialysis_order.force ' +
  'dialysis_order.vitamin_c dialysis_order.vitamin_b12 temp_order temp_order.treat_plan_id ' +
  'dialysis_order.dexamethasone.treat_plan ' +
  'dialysis_order.lowHeparin.treat_plan ' +
  'dialysis_order.normalHeparin.treat_plan ' +
  'dialysis_order.noHeparin.treat_plan dialysis_order.supply dialysis_order.needle dialysis_order.perfusion ' +
  'dialysis_order.dialyzer';

export default function (req) {

  return roleAuthPromise(req, 'read', 'Order', (resolve, reject) => {
    const {record, type} = req.query;
    if (record && type) {
      Order.find({record, type})
           .deepPopulate(deepPopulate)
        .sort({create_time: -1})
        .exec((err, docs) => {
          if (err) {
            console.log(err);
            reject({msg: '查找失败！'});
          } else {
            resolve({
              code: config.code.success,
              data: docs
            });
          }
        });
    } else {
      reject({msg: '缺少参数！'});
    }
  });
}
