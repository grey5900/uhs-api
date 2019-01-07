/**
 * Created by isaac on 16/6/22.
 */
import mongoose from 'mongoose';
import config from '../../../config';
import {roleAuthPromise as rap} from '../../../lib/auth';
const KidneyDiagnosis = mongoose.model('KidneyDiagnosis');

export default function remove(req) {

  return rap(req, 'delete', 'KidneyDiagnosis', (resolve, reject) => {
    const {id} = req.body;

    KidneyDiagnosis.remove({_id: id}, (err) => {
      if (err) {
        console.log(err);
        reject({msg: '删除失败！'});
      } else {
        resolve({code: config.code.success});
      }
    });
  });
}
