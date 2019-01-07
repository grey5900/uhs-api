/**
 * Created by isaac on 2016/3/19.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
import {roleAuthPromise as rap} from '../../lib/auth';
const NutritionAssessment = mongoose.model('NutritionAssessment');

export default function update(req) {

  return rap(req, 'update', 'NutritionAssessment', (resolve, reject) => {

    const id = req.body._id;
    if (id) {
      const args = {... req.body};
      args.update_time = getTime();
      delete args.id;
      NutritionAssessment.findOneAndUpdate({_id: id}, args, (err, doc) => {
        if (!doc || err) {
          reject({msg: '更新失败！'});
        } else {
          resolve({code: config.code.success});
        }
      });
    } else {
      reject({msg: '缺少参数!'});
    }
  });
}
