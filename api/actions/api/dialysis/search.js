/**
 * Created by isaac on 2016/4/1.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const DialysisItem = mongoose.model('DialysisItem');
const Patient = mongoose.model('Patient');
import moment from 'moment';

export default function create(req) {
  return rap(req, 'read', 'DialysisItem', (resolve, reject) => {

    let {startDay, endDay, ...others} = req.query;
    // const today = moment().format('YYYY-MM-DD');
    const nextDay = moment().add(-1, 'days').format('YYYY-M-D');
    // if (!endDay) {
    //   endDay = new Date(nextDay);
    // } else {
    //   endDay = new Date(endDay);
    // }

    if (!startDay) {
      startDay = new Date(nextDay);
      endDay = moment(startDay).add(1, 'days').toDate();
    } else {
      startDay = new Date(startDay);
      endDay = moment(startDay).add(1, 'days').toDate();
    }

    const args = [
      {deleted: false},
      {create_time: {$gte: startDay, $lt: endDay}},
    ];

    if (others.real_name || others.mobile) {
      const hospital = req.headers["x-hospital"];
      const patientArgs = {deleted: false, hospital};
      if (others.real_name) {
        patientArgs.real_name = others.real_name;
      }
      if (others.mobile) {
        patientArgs.mobile = others.mobile;
      }
      Patient.find(patientArgs)
        .exec((err, docs) => {
          if (!err || docs) {
            args.push({patient: docs[0]._id});
            DialysisItem.find({
              $and: args
            })
              .deepPopulate('patient temp_order long_term_order schedule schedule.machine')
              .exec((error, docs) => {
                if (error) {
                  console.log(error);
                  reject({msg: error.message});
                } else {
                  resolve({
                    code: config.code.success,
                    data: docs
                  });
                }
              })
          }
        });

    } else {
      DialysisItem.find({
        $and: args
      })
        .deepPopulate('patient temp_order long_term_order schedule schedule.machine')
        .exec((error, docs) => {
          if (error) {
            console.log(error);
            reject({msg: error.message});
          } else {
            resolve({
              code: config.code.success,
              data: docs
            });
          }
        })
    }
  });
}
