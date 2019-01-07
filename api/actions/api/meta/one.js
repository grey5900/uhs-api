/**
 * Created by isaac on 16/4/16.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const Meta = mongoose.model('Meta');

export default function one(req) {

  return rap(req, 'read', 'Meta', (resolve, reject) => {
    const {value} = req.query;

    Meta.findOne({value}, (error, doc) => {
      if (error) {
        console.log(error);
        reject({msg: '查找失败！'});
      } else {
        resolve({
          code: config.code.success,
          data: doc || {}
        });
      }
    });
  });
}
