/*
 * Copyright(c) omk 2016
 * Filename: remove.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期五, 26 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Patient = mongoose.model('Patient');
const FollowupRecord = mongoose.model('FollowupRecord');
const UserEvent = mongoose.model('UserEvent');

export default function remove(req) {

  return roleAuthPromise(req, 'delete', 'Patient', (resolve, reject) => {

    const {id} = req.body;
    if (id) {
      Patient.findOneAndRemove({_id: id}, (err) => {
        if (err) {
          reject({msg: '删除失败！'});
        } else {
          FollowupRecord.remove({patient: id}, (followerr) => {
            UserEvent.remove({patient: id}, (usererr) => {
              if (!followerr && !followerr) {
                resolve({code: config.code.success});
              }
            })
          })
        }
      });
    } else {
      reject({msg: '缺少参数！'});
    }
  });
}
