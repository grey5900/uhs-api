/**
 * Created by isaac on 2016/3/17.
 */
import mongoose from 'mongoose';
import config from '../../config';
const Diagnosis = mongoose.model('Diagnosis');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function remove(req) {

  return rap(req, 'delete', 'Diagnosis', (resolve, reject) => {

    const {id} = req.body;
    if (id) {
      Diagnosis.findOneAndRemove({_id: id}, (err) => {
        if (err) {
          reject({msg: '删除失败！'});
        } else {
          resolve({code: config.code.success});
        }
      });
    } else {
      reject({msg: '缺少参数！'});
    }
  });
}

