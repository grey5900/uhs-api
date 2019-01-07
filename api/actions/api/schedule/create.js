/**
 * Created by isaac on 2016/3/28.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {orderFromDate, dateToWeekString, getUID} from '../../lib/util';
import {roleAuthPromise as rap} from '../../lib/auth';
const DoctorSchedule = mongoose.model('DoctorSchedule');
const DoctorScheduleItem = mongoose.model('DoctorScheduleItem');
const PatientSchedule = mongoose.model('PatientSchedule');
const PatientScheduleItem = mongoose.model('PatientScheduleItem');

export default function create(req) {

    const {type, args} = req.body;
    const hospital = req.headers['x-hospital'];

    if (type === 'patient') {
      return rap(req, 'create', 'PatientSchedule', (resolve, reject) => {
        const schedule = new PatientSchedule();

        schedule.hospital = hospital;
        schedule.creator = getUID(req);
        schedule.deleted = false;
        args.items.forEach((info) => {
          let item = new PatientScheduleItem(info);
          item.deleted = false;
          item.save();
          schedule.items.push(item);
        });
        schedule.save((error) => {
          if (error) {
            console.log(error.message);
            reject({msg: error.message});
          } else {
            resolve({
              code: config.code.success,
              data: schedule
            });
          }
        });
      });
    }else {
      return rap(req, 'create', 'DoctorSchedule', (resolve, reject) => {
        const schedule_time = new Date(args.schedule_time);

        const schedule = new DoctorSchedule();
        schedule.hospital = hospital;
        schedule.name = args.name;
        schedule.type = args.type;
        schedule.is_template = false;
        schedule.order = orderFromDate(schedule_time);
        // schedule.time = schedule_time;
        schedule.schedule_date = schedule_time;
        schedule.schedule_week = dateToWeekString(schedule_time);
        schedule.deleted = false;
        schedule.creator = getUID(req);
        args.items.forEach((info) => {
          let item = new DoctorScheduleItem(info);
          item.deleted = false;
          item.save();
          schedule.items.push(item);
        });
        if (args.is_template) {
          const templateSchedule = new DoctorSchedule();
          templateSchedule.hospital = hospital;
          templateSchedule.name = args.name;
          templateSchedule.is_template = true;
          templateSchedule.order = schedule.order;
          // schedule.time = schedule_time;
          templateSchedule.schedule_date = schedule.schedule_date;
          templateSchedule.schedule_week = schedule.schedule_week;
          templateSchedule.type = schedule.type;
          templateSchedule.deleted = false;
          templateSchedule.creator = schedule.creator;
          args.items.forEach((info) => {
            let item = new DoctorScheduleItem(info);
            item.deleted = false;
            item.save();
            templateSchedule.items.push(item);
          });
          templateSchedule.save();
        }
        schedule.save((error) => {
          if (error) {
            console.log(error);
            reject({msg: error.message});
          } else {
            resolve({
              code: config.code.success,
              data: schedule
            });
          }
        });
      });
    }
}
