/**
 * Created by isaac on 16/4/27.
 */
import mongoose from 'mongoose';
import config from '../../config';
import url from 'url';
import {roleAuthPromise as rap} from '../../lib/auth';
const Doctor = mongoose.model('Doctor');

export default function search(req) {
  return rap(req, 'read', 'Doctor', (resolve, reject) => {
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
      const exp = new RegExp(search, 'i');
      const args = {
        $and: [
          {deleted: false},
          {hospital},
          {$or: [
            {name: exp},
            {mobile: exp}
          ]}
        ]
      };
      Doctor.count(args, (error, count) => {
        if (error) {
          reject({msg: error.message});
        } else {
          if (count === 0) {
            resolve({
              code: config.code.success,
              data: {
                total: 0,
                data: []
              }
            });
          } else {
            Doctor.find(args)
              .select('-__v')
              .populate('medicare hospital record dialysis_machine dialysis_supplies avatar')
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
                      data: docs
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
