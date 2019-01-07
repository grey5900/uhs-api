/**
 * Created by chris on 16/3/28.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
import url from 'url';
const Admin = mongoose.model('Admin');

export default function search(req) {

    return rap(req, 'read', 'Admin', (resolve, reject) => {
    const obj = url.parse(req.url, true);
    const {search} = obj.query;
    const hospital = req.headers["x-hospital"];
    let skip = parseInt(obj.query.skip);
    let limit = parseInt(obj.query.limit);
    if (!skip) {
      skip = 0;
    }
    if (!limit) {
      limit = 20;
    }
    if (search && hospital) {
      const exp = new RegExp(search, 'gim');
      const args = {
        $and: [
          {hospital},
          {$or: [
            {name: exp},
            {nick_name: exp},
            {email: exp}
          ]}
        ]
      };
      Admin.count(args, (error, count) => {
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
            Admin.find(args)
              .select('-__v')
              .skip(skip)
              .limit(limit)
              .populate('doctor')
              .exec((err, docs) => {
                if (err || !docs) {
                  console.log(err);
                  reject({msg: '查找失败！'});
                } else {
                  resolve({
                    code: config.code.success,
                    data: {
                      total: count,
                      admins: docs
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
