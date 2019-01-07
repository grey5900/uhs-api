/**
 * Created by isaac on 16/6/22.
 */
import mongoose from 'mongoose';
import config from '../../../config';
import {getTime} from '../../../lib/util';
const KidneyDiagnosis = mongoose.model('KidneyDiagnosis');
import {roleAuthPromise as rap} from '../../../lib/auth';

export default function update(req) {

  return rap(req, 'update', 'KidneyDiagnosis', (resolve, reject) => {
    const {id, args} = req.body;
    args.update_time = getTime();
    KidneyDiagnosis.findOneAndUpdate({_id: id}, args, (err) => {
      if (err) {
        console.log(err);
        reject({msg: '更新失败！'});
      } else {
        resolve({code: config.code.success});
      }
    });
  });
}
