/**
 * Created by isaac on 2016/3/19.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const NutritionAssessment = mongoose.model('NutritionAssessment');

export default function create(req) {

  return rap(req, 'create', 'NutritionAssessment', (resolve, reject) => {
    const info = {
      ...req.body,
      deleted: false
    };
    const assessment = new NutritionAssessment(info);
    assessment.save((error) => {
      if (error) {
        console.log(error.message);
        reject({msg: '添加失败！'});
      } else {
        resolve({
          code: config.code.success,
          data: assessment
        });
      }
    });
  });
}
