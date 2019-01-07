/**
 * Created by chris on 16/4/1.
 */
import mongoose from 'mongoose';
import config from '../../config';
const FollowupRecord = mongoose.model('FollowupRecord');
const UserEvent = mongoose.model('UserEvent');
import createCureDiary from '../curediary/create';
import {getUID} from '../../lib/util';
import {roleAuthPromise} from '../../lib/auth';

export default function create(req) {

  return roleAuthPromise(req, 'create', 'FollowupRecord', (resolve, reject) => {
    const info = {
      ...req.body,
      deleted: false,
      first_visit: true
    };
    const followupRecord = new FollowupRecord(info);
    followupRecord.creator = getUID(req);
    followupRecord.save((err, doc) => {
      if (err) {
        console.log(err);
        reject({msg: '创建失败！'});
      } else {
        createCureDiary(info.patient, (diary) => {
          diary.events.push({
            target_id: followupRecord,
            model: 'FollowupRecord',
            content: `<a href="/followup/${followupRecord.id}">[今日随访]</a>`
          });
        });
        if (info.userevent) {
          UserEvent.findOneAndUpdate({_id: info.userevent}, {target_id: doc._id}, (error) => {
            if (error) {
              reject({msg: error.message});
            } else {
              resolve({
                code: config.code.success,
                data: doc
              });
            }
          });
        }
      }
    });
  });
}
