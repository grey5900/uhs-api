/**
 * Created by isaac on 2016/4/1.
 */
import mongoose from 'mongoose';
import config from '../../config';
import moment from 'moment';
import {roleAuthPromise as rap} from '../../lib/auth';

const DialysisItem = mongoose.model('DialysisItem');
const DialysisPlan = mongoose.model('DialysisPlan');
const PatientScheduleItem = mongoose.model('PatientScheduleItem');

import {getUID} from '../../lib/util';

function mergedDialysisByPlan(dialysis, scheduleID, dialysisPlan) {
  if (dialysis && dialysisPlan) {
    dialysis.machineInfo.dialyser_type = dialysisPlan.dialyzer;

    // merge treat methods && path
    PatientScheduleItem.findOne({_id: scheduleID})
      .exec((error, doc) => {
        if (doc) {
          dialysis.treat_methods = doc.type;
          dialysis.save();
        }
      });
    dialysis.pathType = dialysisPlan.path_type;
    if (dialysisPlan.paths) {
      dialysis.paths = dialysisPlan.paths.slice(0);
    }

    console.log(30, dialysisPlan.items);
    if (dialysisPlan.items && dialysisPlan.items.length > 0) {
      dialysisPlan.items.forEach(looper => {
        if (looper.drug) {
          const obj = {};
          obj.drug = looper.drug;
          obj.disease = looper.disease;
          obj.amount = looper.amount;
          obj.cycle = looper.cycle;
          obj.current_amount = '';
          dialysis.drugs.push(obj);
        }
      });
    }
    console.log(44, dialysis.drugs);
  }
}

export function createDialysis(req, info, resolve, reject) {
  const {patient, schedule} = info;
  const dialysis = new DialysisItem(info);
  dialysis.creator = getUID(req);
  DialysisPlan.find({patient})
    .sort({create_time: -1})
    .limit(1)
    .exec((error, plans) => {
      if (error) {
        console.log(error);
        reject({msg: error.message});
      } else {
        const plan = plans ? plans[0] : null;
        mergedDialysisByPlan(dialysis, schedule, plan);
        dialysis.save((error) => {
          if (error) {
            console.log(error);
            reject({msg: error.message});
          } else {
            resolve({
              code: config.code.success,
              dialysis
            });
          }
        });
      }
    });
}

export default function (req) {
  return rap(req, 'create', 'DialysisItem', (resolve, reject) => {
    const info = {
      ...req.body,
      deleted: false
    };
    const today = moment().format('YYYY-M-DD');
    const todayNext = moment().add(1, 'days').format('YYYY-M-DD');
    const startDay = new Date(today);
    const endDay = new Date(todayNext);
    const {patient} = info;
    const args = [
      {patient},
      {create_time: {$gte: startDay, $lt: endDay}}
    ];
    DialysisItem.findOne({$and: args}, (err, doc) => {
      if (doc) {
        reject({msg: '已经签到'});
      } else {
        createDialysis(req, info, resolve, reject);
      }
    })
  });
}
