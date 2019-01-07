/**
 * Created by isaac on 2016/3/19.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const NutritionAssessment = mongoose.model('NutritionAssessment');

export default function remove(req) {
  return rap(req, 'delete', 'NutritionAssessment', (resolve, reject) => {
    const {id} = req.body;
    if (id) {
      NutritionAssessment.findOneAndUpdate({_id: id}, {deleted: true},
        (err) => {
          if (err) {
            reject({msg: '删除失败！'});
          } else {
            resolve({code: config.code.success});
          }
        });
    }
  });
}
