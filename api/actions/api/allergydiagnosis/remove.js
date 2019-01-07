/**
 * Created by Grey on 16/7/3.
 */
import mongoose from 'mongoose';
import {roleAuthPromise as rap} from '../../lib/auth';
import config from '../../config';

const AllergyDiagnosis = mongoose.model('AllergyDiagnosis');

export default function remove(req) {

  return rap(req, 'delete', 'AllergyDiagnosis', (resolve, reject) => {
    const {id} = req.body;

    AllergyDiagnosis.remove({_id: id}, (err) => {
      if (err) {
        reject({msg: '删除失败！'});
      } else {
        resolve({code: config.code.success});
      }
    });
  });
}
