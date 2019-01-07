/**
 * Created by isaac on 2016/3/19.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const Diagnosis = mongoose.model('Diagnosis');

export default function all(req) {

  return rap(req, 'read', 'Diagnosis', (resolve, reject) => {
    let skip = parseInt(req.query.skip);
    let limit = parseInt(req.query.limit);
    if (!skip) {
      skip = 0;
    }
    if (!limit) {
      limit = 20;
    }
    const {patient} = req.query;
    const args = {patient, deleted: false};
    Diagnosis.count(args, (error, count) => {
      if (error) {
        reject({msg: error.message});
      } else {
        if (count === 0) {
          resolve({
            code: config.code.success,
            data: {
              total: 0
            }
          });
        } else {
          Diagnosis.find(args)
            .skip(skip).limit(limit)
            .exec((err, docs) => {
              if (err) {
                console.log(err);
                reject({msg: '查找失败！'});
              } else {
                resolve({
                  code: config.code.success,
                  data: {
                    total: count,
                    diagnosis: docs
                  }
                });
              }
            });
        }
      }
    });
  });
}
