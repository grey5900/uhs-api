/**
 * Created by isaac on 16/6/30.
 */
import {registerProcessor} from './processors';
import {dialysisSchedule, doctorSchedule} from './constants';
import mongoose from 'mongoose';
import {addMessage, getUID} from './func';
const Patient = mongoose.model('Patient');

registerProcessor(dialysisSchedule, (request, context) => {
  const {schedule} = context;
  const userID = getUID(request);
  const {schedule_week} = schedule;
  const arr = schedule_week.split('_');
  addMessage({
    title: `${arr[0]}年${arr[1]}月-第${arr[2]}周的血透排班变更了`,
    url: `/diaschedule/${schedule._id}`,
    level: 3,
    origin: schedule._id,
    receiver: userID,
    creator: userID
  }, context);
});

registerProcessor(doctorSchedule, (request, context) => {
  const {schedule} = context;
  const userID = getUID(request);
  const {schedule_week} = schedule;
  const arr = schedule_week.split('_');
  addMessage({
    title: `${arr[0]}年${arr[1]}月-第${schedule.order}周的医护排班变更了`,
    url: `/schedule/${schedule._id}`,
    level: 3,
    origin: schedule._id,
    receiver: userID,
    creator: userID
  }, context);
});