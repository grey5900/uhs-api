/**
 * Created by isaac on 2016/4/1.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {judge} from '../message/observers';
import constants from '../message/observers/constants';
import {getTime} from '../../lib/util';
import {roleAuthPromise as rap} from '../../lib/auth';
const DialysisItem = mongoose.model('DialysisItem');
const Order = mongoose.model('Order');

export default function (req, params, ctx) {
  return rap(req, 'update', 'DialysisItem', (resolve, reject) => {
    const {id, long_term_order, temp_order, ...others} = req.body;
    others.update_time = getTime();
    delete others._id;

    judge(constants.dialysis, req, {id, ...ctx});

    if (long_term_order || temp_order) {
      if (long_term_order && long_term_order._id) {
        Order.findOneAndUpdate({_id: long_term_order._id}, {...long_term_order}, (err, doc) => {
          if (!doc) {
            reject({msg: '医嘱不存在!'});
          } else if (err) {
            reject({msg: '更新失败!'});
          }
        });

        DialysisItem.findOneAndUpdate({_id: id}, {...others}, (error) => {
          if (error) {
            console.log(error);
            reject({msg: error.message});
          } else {
            resolve({code: config.code.success});
          }
        });
      }

      if (temp_order && temp_order._id) {
        Order.findOneAndUpdate({_id: temp_order._id}, {...temp_order}, (err, doc) => {
          if (!doc) {
            reject({msg: '医嘱不存在!'});
          } else if (err) {
            reject({msg: '更新失败!'});
          }
        });

        DialysisItem.findOneAndUpdate({_id: id}, {...others}, (error) => {
          if (error) {
            console.log(error);
            reject({msg: error.message});
          } else {
            resolve({code: config.code.success});
          }
        });
      }

      if (temp_order && !temp_order._id) {
        temp_order.type = 'temp';
        const order = new Order(temp_order);
        order.save((error) => {
          if (error) {
            console.log(error.message);
            reject({msg: '医嘱添加失败！'});
          }
        });

        DialysisItem.findOneAndUpdate({_id: id}, {...others, temp_order: order._id}, (error) => {
          if (error) {
            console.log(error);
            reject({msg: error.message});
          } else {
            resolve({code: config.code.success});
          }
        });
      }

      if (long_term_order && !long_term_order._id) {
        const order = new Order(long_term_order);
        order.save((error) => {
          if (error) {
            console.log(error.message);
            reject({msg: '医嘱添加失败！'});
          }
        });

        DialysisItem.findOneAndUpdate({_id: id}, {...others, long_term_order: order._id}, (error) => {
          if (error) {
            console.log(error);
            reject({msg: error.message});
          } else {
            resolve({code: config.code.success});
          }
        });
      }
    } else {
      DialysisItem.findOneAndUpdate({_id: id}, others, (error) => {
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

