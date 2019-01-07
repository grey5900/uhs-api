/**
 * Created by isaac on 16/4/30.
 */
import mongoose from 'mongoose';
import moment from 'moment';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
import {dateToWeekString, getUID} from '../../lib/util';

const DoctorSchedule = mongoose.model('DoctorSchedule');
const DoctorScheduleItem = mongoose.model('DoctorScheduleItem');
const PatientScheduleTemplate = mongoose.model('PatientScheduleTemplate');
const PatientSchedule = mongoose.model('PatientSchedule');
const PatientScheduleItem = mongoose.model('PatientScheduleItem');

export default function create(req) {

  return rap(req, 'create', 'Schedule', (resolve, reject) => {
    const {type, args} = req.body;
    const hospital = req.headers['x-hospital'];
    if (type === 'patient') {
      PatientScheduleTemplate.update({hospital}, {$set: {is_current: false}}, { multi: true });

      const template = new PatientScheduleTemplate();

      template.name = args.name;
      template.hospital = hospital;
      template.creator = getUID(req);
      template.deleted = false;
      template.is_current = true;
      template.schedule_time = args.schedule_time;
      const monday_items = [];
      const wednesday_items = [];
      const friday_items = [];
      args.odd_items.forEach((info) => {
        let obj = {...info};
        obj.deleted = false;

        let item = new PatientScheduleItem(obj);
        item.save();
        monday_items.push(item);

        item = new PatientScheduleItem(obj);
        item.save();
        wednesday_items.push(item);

        item = new PatientScheduleItem(obj);
        item.save();
        friday_items.push(item);

        item = new PatientScheduleItem(obj);
        item.save();
        template.odd_items.push(item);
      });
      const tuesday_items = [];
      const thursday_items = [];
      const saturday_items = [];
      args.even_items.forEach((info) => {
        let obj = {...info};
        obj.deleted = false;

        let item = new PatientScheduleItem(obj);
        item.save();
        tuesday_items.push(item);

        item = new PatientScheduleItem(obj);
        item.save();
        thursday_items.push(item);

        item = new PatientScheduleItem(obj);
        item.save();
        saturday_items.push(item);

        item = new PatientScheduleItem(obj);
        item.save();
        template.even_items.push(item);
      });

      template.save((error) => {
        if (error) {
          console.log(error);
          reject({msg: error.message});
        } else {
          // create schedule of this week
          var time = args.schedule_time;
          var startDate = moment(time).startOf('week').toDate(); // it's sunday!!!

          const schedule = new PatientSchedule();
          schedule.hospital = hospital;
          schedule.tuesday_items = tuesday_items;
          schedule.thursday_items = thursday_items;
          schedule.saturday_items = saturday_items;

          schedule.monday_items =    monday_items;
          schedule.wednesday_items = wednesday_items;
          schedule.friday_items =    friday_items;

          schedule.template = template;
          var schedule_date = moment(startDate).add(1, 'days').toDate();
          schedule.schedule_date = schedule_date;
          schedule.schedule_week = dateToWeekString(schedule_date);
          schedule.creator = getUID(req);
          schedule.deleted = false;
          schedule.save();

          resolve({
            code: config.code.success,
            data: template
          });
        }
      });
    } else {
      const schedule = new DoctorSchedule();

      console.log(schedule, '排班');
      schedule.name = args.name;
      schedule.is_template = args.is_template;
      schedule.order = args.order;
      schedule.deleted = false;
      schedule.creator = getUID(req);
      schedule.time = args.time;
      args.items.forEach((info) => {
        let item = new DoctorScheduleItem(info);
        item.deleted = false;
        item.save();
        schedule.items.push(item);
      });

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
    }
  });
}
