/**
 * Created by isaac on 16/7/12.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Order = mongoose.model('Order');
import {deepPopulate} from './all';

export default function(req) {

  return roleAuthPromise(req, 'read', 'Order', (resolve, reject) => {
    const {record, type} = req.query;
    Order.find({record, type})
      .deepPopulate(deepPopulate)
      .sort({create_time: -1})
      .limit(1)
      .exec((err, doc) => {
        if (err) {
          reject({msg: '查找失败'});
        } else {
          const data = doc[0] || {};
          resolve({
            code: config.code.success,
            data
          });
        }
      });
  });
}
