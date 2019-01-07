/**
 * Created by isaac on 2/21/16.
 */

import mongoose from 'mongoose';
import {roleAuthPromise as rap} from '../../lib/auth';
import config from '../../config';
const Admin = mongoose.model('Admin');

export default function all(req) {
  return rap(req, 'read', 'Admin', (resolve, reject) => {
    let skip = parseInt(req.query.skip);
    let limit = parseInt(req.query.limit);
    if (!skip) {
      skip = 0;
    }
    if (!limit) {
      limit = 20;
    }
    Admin.count({}, (error, count) => {
      if (error) {
        reject({msg: error.message});
      } else {
        if (count === 0) {
          resolve({
            code: config.code.success,
            data: {
              total: 0,
              admins: []
            }
          });
        } else {
          Admin.find({})
            .select('name department position role email nick_name doctor')
            .skip(skip)
            .limit(limit)
            .populate('doctor')
            .exec((err, docs) => {

              if (err) {
                reject({
                  msg: '查找出错！'
                });
              } else {
                resolve({
                  code: config.code.success,
                  data:{
                    total: count,
                    admins: docs
                  }
                });
              }
            })
        }
      }
    })
  });
}
