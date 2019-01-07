/**
 * Created by isaac on 2016/3/23.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {addDoctor} from '../../lib/util';
const Patient = mongoose.model('Patient');

export default function list(req) {

  return new Promise((resolve, reject) => {
    let skip = parseInt(req.query.skip);
    let limit = parseInt(req.query.limit);
    if (!skip) {
      skip = 0;
    }
    if (!limit) {
      limit = 20;
    }
    const hospital = req.headers["x-hospital"];
    const args = {deleted: false, hospital};
    // addDoctor(req, args);
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
            .populate('medicare hospital record dialysis_machine dialysis_supplies avatar outcome')
            .skip(skip)
            .limit(limit)
            .sort({create_time: -1})
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
  });
}
