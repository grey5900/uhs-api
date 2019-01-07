/**
 * Created by isaac on 2016/3/17.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
const Diagnosis = mongoose.model('Diagnosis');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function update(req) {

  return rap(req, 'update', 'Diagnosis', (resolve, reject) => {
    const {id, args} = req.body;
    if (id) {
      args.update_time = getTime();
      Diagnosis.findOneAndUpdate({_id: id}, args, (error) => {
        if (error) {
          reject({msg: error.message});
        } else {
          resolve({code: config.code.success});
        }
      });
    } else {
      reject({msg: '缺少参数！'});
    }
  });
}
