/**
 * Created by isaac on 16/8/16.
 */

import {CronJob} from 'cron';
import mongoose from 'mongoose';
import moment from 'moment';
import {dateToWeekString} from '../actions/lib/util';
var DoctorSchedule = mongoose.model('DoctorSchedule');
var PatientSchedule = mongoose.model('PatientSchedule');
import {addMessage} from '../actions/api/message/observers/func';

import {deepFields} from '../actions/api/schedule/one';

// const Timing = 12;
const indexToKey = [
  '',
  'monday_items',
  'tuesday_items',
  'wednesday_items',
  'thursday_items',
  'friday_items',
  'saturday_items'
];

let job = null;
export default function () {
  const func = () => {
    const today = new Date();
    PatientSchedule.findOne({
      schedule_week: dateToWeekString(today)
    }).deepPopulate(deepFields)
      .exec((err, doc) => {
        if (err) {
          console.log(err);
        } else {
          const tomorrow = moment(today).add(1, 'days').toDate().getDay();
          // ignore sunday!!!
          //
          if (tomorrow !== 0 && doc) {
            const tomorrowString = indexToKey[tomorrow];
            const totalPatients = doc[tomorrowString] ? doc[tomorrowString].length : 0;
            if (totalPatients > 0) {
              const singlePatient = 500 * 240;
              const totalLiquid = totalPatients * singlePatient;

              const creator = doc.creator;
              const scheduleID = doc.id;

              addMessage({
                title: `明天需要需要配液 ${totalLiquid / 1000} L`,
                url: `/diaschedule/${scheduleID}`,
                level: 3,
                origin: scheduleID,
                receiver: creator,
                creator
              }, {});
            }
          }
        }
      });
  };

  if (!job) {
    // everyday's 12 o'clock
    const cronTime = '0 12 * * *';
    job = new CronJob({
      // cronTime: `* * * ${Timing} * * *`,
      cronTime,
      onTick: func,
      start: false,
      timeZone: 'Asia/Chongqing'
    });
    job.start();
    console.log('start diaschedule cron job!');
  }
}
