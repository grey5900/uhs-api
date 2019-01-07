/**
 * Created by isaac on 16/5/3.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
import {roleAuthPromise} from '../../lib/auth';
const FollowupRecord = mongoose.model('FollowupRecord');

export default function update_home_followup(req) {

  return roleAuthPromise(req, 'update', 'FollowupRecord', (resolve, reject) => {
    const {_id, doctor, home} = req.body;

    FollowupRecord.findOneAndUpdate({_id}, {
      first_visit: false,
      doctor,
      home,
      update_time: getTime()
    }, (err, doc) => {
      if (err || !doc) {
        reject({msg: '更新失败'});
      } else {
        resolve({code: config.code.success});
      }
    });
  });
}
