/**
 * Created by isaac on 16/4/16.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
import {roleAuthPromise as rap} from '../../lib/auth';
const Meta = mongoose.model('Meta');

export default function update(req) {

  return rap(req, 'update', 'Meta', (resolve, reject) => {
    const {name, value, list} = req.body;

    Meta.findOneAndUpdate({name}, {value, list, update_time: getTime()}, (error) => {
      if (error) {
        console.log(error.message);
        reject({msg: '添加失败！'});
      } else {
        resolve({
          code: config.code.success
        });
      }
    });
  });
}
