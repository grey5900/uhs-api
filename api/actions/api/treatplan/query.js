/**
 * Created by isaac on 16/7/12.
 */
import mongoose from 'mongoose';
import config from '../../config';
import url from 'url';
import {syncTreatplan} from './sync';
import {roleAuthPromise} from '../../lib/auth';
const TreatPlan = mongoose.model('TreatPlan');

export default function (req, params, ctx) {
  const parsedURL = url.parse(req.url, true);
  const {q, jzh} = parsedURL.query;

  return roleAuthPromise(req, 'read', 'TreatPlan', (resolve, reject) => {
    const exp = new RegExp(q, 'i');
    TreatPlan.find({item_name: exp, jzh, deleted: false})
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
