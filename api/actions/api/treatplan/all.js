/**
 * Created by isaac on 16/7/20.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {syncTreatplan} from './sync';
import {roleAuthPromise} from '../../lib/auth';
const TreatPlan = mongoose.model('TreatPlan');

export default function (req, params, ctx) {
  const {jzh} = req.query;

  return roleAuthPromise(req, 'read', 'TreatPlan', (resolve, reject) => {
    // find in db
    TreatPlan.find({jzh, deleted: false})
      .exec((err, docs) => {
        if (err) {
          console.log(err);
          reject({msg: '查找失败！'});
        } else {
          console.log('response', docs);
          resolve({
            code: config.code.success,
            data: docs
          });
        }
      });
  });
}
