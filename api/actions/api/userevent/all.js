/**
 * Created by isaac on 2016/3/31.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const UserEvent = mongoose.model('UserEvent');

export default function (req) {
  return rap(req, 'read', 'UserEvent', (resolve, reject) => {
    let skip = parseInt(req.query.skip);
    let limit = parseInt(req.query.limit);
    if (!skip) {
      skip = 0;
    }
    if (!limit) {
      limit = 20;
    }
    const {patient, doctor, target_id, type} = req.query;
    const args = [{deleted: false}];
    if (patient) {
      args.push({ patient });
    }
    if (doctor) {
      args.push({ doctor });
    }
    if (target_id) {
      args.push({ target_id });
    }
    if (type) {
      if (type === 'followup') {
        args.push({type: {$in: ['inpatient', 'home']}});
      } else {
        args.push({ type });
      }
    }

    UserEvent.count({$and: args}, (error, count) => {
      if (error) {
        reject({msg: error.message});
      } else {
        if (count === 0) {
          resolve({
            code: config.code.success,
            data: {
              total: 0,
              allUserEvents: []
            }
          });
        } else {
          UserEvent.find({$and: args})
                   .skip(skip)
                   .limit(limit)
                   .populate('patient doctor')
                   .sort({'start_time': -1})
                   .exec((err, docs) => {
                     if (err) {
                       reject({msg: err.message});
                     } else {
                       resolve({
                         code: config.code.success,
                         data: {
                           total: count,
                           allUserEvents: docs
                         }
                       })
                     }
                   })
        }
      }
    })
  });
}
