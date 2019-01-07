/**
 * Created by isaac on 16/4/16.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const Meta = mongoose.model('Meta');

export default function create(req) {

  return rap(req, 'create', 'Meta', (resolve, reject) => {
    const info = req.body;
    const {name} = info;

    Meta.findOne({name}, (err, doc) => {
      if (doc) {
        reject({msg: '已存在！'});
      } else {
        const meta = new Meta(info);
        meta.save((error) => {
          if (error) {
            console.log(error.message);
            reject({msg: '添加失败！'});
          } else {
            resolve({
              code: config.code.success,
              data: meta
            });
          }
        });
      }
    });
  });
}
