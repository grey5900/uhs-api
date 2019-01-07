/**
 * Created by isaac on 16/6/16.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
import {roleAuthPromise} from '../../lib/auth';
const PatientScheduleItem = mongoose.model('PatientScheduleItem');
const DoctorScheduleItem = mongoose.model('DoctorScheduleItem');

export default function (req) {
  const {type, id, args} = req.body;
  args.update_time = getTime();
  if (type === 'patient') {
    return roleAuthPromise(req, 'update', 'PatientSchedule', (resolve, reject) => {
      PatientScheduleItem.findOneAndUpdate({_id: id}, args, (err) => {
        if (err) {
          console.log(err);
          reject({msg: '更新失败！'});
        } else {
          resolve({code: config.code.success});
        }
      });
    });
  } else {
    return roleAuthPromise(req, 'update', 'DoctorSchedule', (resolve, reject) => {
      DoctorScheduleItem.findOneAndUpdate({_id: id}, args, (err) => {
        if (err) {
          console.log(err);
          reject({msg: '更新失败！'});
        } else {
          resolve({code: config.code.success});
        }
      });
    });
  }
}
