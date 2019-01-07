/**
 * Created by isaac on 16/3/8.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
const DrugType = mongoose.model('DrugType');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function update(req) {

  return rap(req, 'update', 'DrugType', (resolve, reject) => {

    const {id} = req.body;

    if (id) {
      const params = {...req.body};
      params.update_time = getTime();
      delete params.id;
      DrugType.findOneAndUpdate({_id: id}, params, (err) => {
        if (!doc) {
          reject({msg: '药品不存在!'});
        } else if (err) {
          reject({msg: '更新失败！'});
        } else {
          resolve({code: config.code.success});
        }
      });
    } else {
      reject({msg: '缺少参数！'});
    }
  });
}

