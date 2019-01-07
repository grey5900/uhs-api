/**
 * Created by isaac on 2016/3/31.
 */
import mongoose from 'mongoose';
import config from '../../config';
import moment from 'moment';
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
    const today = new Date().setHours(0,0,0,0);
    const tomorrow = moment(today).add(1, 'days').toDate();
    const args = [
      {deleted: false},
      {$or: [{type: 'inpatient'}, {type: 'home'}]},
      {start_time: {$gte: today, $lt: tomorrow}},
      {doctor: req.query.doctor}
    ];
    if (req.query.todo) {
      args.push({target_id: null});
    }

    UserEvent.count({$and: args}, (error, count) => {
      if (error) {
        reject({msg: error.message});
      } else {
        console.log('count', count);
        if (count === 0) {
          resolve({
            code: config.code.success,
            data: {
              total: 0,
              todayFollowups: []
            }
          });
        } else{
          UserEvent.find({$and: args})
            .select('-__v')
            .skip(skip)
            .limit(limit)
            .populate('patient doctor')
          .sort({'target_id': 1})
            .exec((error, docs) => {
              if (error) {
                console.log(error);
                reject({msg: error.message});
              } else {
                console.log('docs', docs);
                resolve({
                  code: config.code.success,
                  data: {
                    total: count,
                    todayFollowups: docs
                  }
                });
              }
            });
        }
      }
    })
  });
}
