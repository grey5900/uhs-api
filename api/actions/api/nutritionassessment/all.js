/**
 * Created by isaac on 2016/3/19.
 */
import mongoose from 'mongoose';
import {roleAuthPromise as rap} from '../../lib/auth';
import config from '../../config';
const NutritionAssessment = mongoose.model('NutritionAssessment');

export default function all(req) {
  return rap(req, 'read', 'NutritionAssessment', (resolve, reject) => {
    let skip = parseInt(req.query.skip);
    let limit = parseInt(req.query.limit);
    const {patient} = req.query;
    if (!skip) {
      skip = 0;
    }
    if (!limit) {
      limit = 20;
    }
    if (patient) {
      NutritionAssessment.count({patient: patient, deleted: false}, (error, count) => {
        if (error) {
          reject({msg: error.message});
        } else {
          if (count === 0) {
            resolve({
              code: config.code.success,
              data: {
                total: 0,
                nutritionAssessments: []
              }
            });
          } else {
            NutritionAssessment.find({patient, deleted: false})
              .select('-__v')
              .skip(skip)
              .limit(limit)
            .sort({'assessment_time': -1})
              .exec((err, docs) => {
                if (err) {
                  console.log(err);
                  reject({msg: '查找失败！'});
                } else {
                  resolve({
                    code: config.code.success,
                    data: {
                      total: count,
                      nutritionAssessments: docs
                    }
                  });
                }
              });
          }
        }
      })
    } else {
      reject({msg: '缺失参数!'});
    }
  });
}
