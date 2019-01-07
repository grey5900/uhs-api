/**
 * Created by chris on 16/3/28.
 */
import mongoose from 'mongoose';
import config from '../../config';
import url from 'url';
import generateDateDuration from '../../utils/searchDate';
import {roleAuthPromise as rap} from '../../lib/auth';
const NutritionAssessment = mongoose.model('NutritionAssessment');

export default function search(req) {

  return rap(req, 'read', 'NutritionAssessment', (resolve, reject) => {
    console.log('search', req.url);
    const obj = url.parse(req.url, true);
    const {search, patient} = obj.query;
    let skip = parseInt(obj.query.skip);
    let limit = parseInt(obj.query.limit);
    if (!skip) {
      skip = 0;
    }
    if (!limit) {
      limit = 20;
    }
    if (search && patient) {
      const dateDuration = generateDateDuration(search);
      const {date, nextDate} = dateDuration;
      const args = {
        $and: [
          {deleted: false},
          {patient: patient},
          {assessment_time: {$gte: date, $lt: nextDate}}
        ]
      };
      NutritionAssessment.count(args, (error, count) => {
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
            NutritionAssessment.find(args)
              .select('-__v')
              .skip(skip)
              .limit(limit)
              .exec((err, docs) => {
                if (err || !docs) {
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
      });
    } else {
      reject({msg: '缺少参数!'});
    }
  });
}
