/**
 * Created by isaac on 16/7/28.
 */
import mongoose from 'mongoose';
import config from '../../../config';
import {roleAuthPromise} from '../../../lib/auth';
const Order = mongoose.model('Order');
const {ObjectId} = mongoose.Types;

export default function (req) {
  return roleAuthPromise(req, 'read', 'Order', (resolve, reject) => {
    const {records} = req.body;
    console.log('records', records);
    if (records) {
      if (records.length === 0) {
        resolve({
          code: config.code.success,
          data: []
        });
      } else {
        const recordIDs = records.map((item) => {
          return new ObjectId(item);
        });
        Order.aggregate([
          {$match: {$and: [{type: 'dialysis'}, {record: {$in: recordIDs}}]}},
          {$sort: {create_time: -1}},
          {$group: {_id: '$record', order: {$first: '$_id'}, dialysis_order: {$first: '$dialysis_order'}}}
        ]).exec((err, docs) => {
          if (err) {
            console.log(err);
            reject({msg: '查找失败！'});
          } else {
            const orderIDs = docs.map(({order}) => order);
            Order.find({_id: {$in: orderIDs}})
              .deepPopulate('dialysis_order.supply dialysis_order.dialyzer dialysis_order.needle dialysis_order.perfusion')
              .exec((error, docs) => {
              if (error) {
                console.log(error);
                reject({msg: error.message});
              } else {
                resolve({
                  code: config.code.success,
                  data: docs
                });
              }
            });
          }
        });
      }
    } else {
      reject({msg: '缺少病历ID！'});
    }
  });
}
