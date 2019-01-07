/**
 * Created by yons on 16/3/12.
 */
import mongoose from 'mongoose';
import config from '../../config';
import url from 'url';
import {addDoctor} from '../../lib/util';
import {roleAuthPromise} from '../../lib/auth';
const Patient = mongoose.model('Patient');

export default function search(req) {

  return roleAuthPromise(req, 'read', 'Patient', (resolve, reject) => {
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
      // const doctor = {};
      // addDoctor(req, doctor);
      const args = {
        $and: [
          {deleted: false},
          {hospital},
          {$or: [
            {real_name: exp},
            {mobile: exp},
            {person_id: exp}
          ]},
          // doctor
        ]
      };
      Patient.count(args, (error, count) => {
        if (error) {
          reject({msg: error.message});
        } else {
          if (count === 0) {
            resolve({
              code: config.code.success,
              data: {
                total: 0,
                patients: []
              }
            });
          } else {
            Patient.find(args)
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
                      patients: docs
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
