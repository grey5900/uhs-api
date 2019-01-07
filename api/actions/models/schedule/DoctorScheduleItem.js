/**
 * Created by isaac on 2016/3/21.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../../lib/util';

//医护排班
var DoctorScheduleItemSchema = mongoose.Schema({

  doctor        : {type: ObjectId, ref: 'Doctor'},
  group         : String, // group of doctor
  day           : {type: Number, enum: [1, 2, 3, 4, 5, 6, 7]}, //1 ~ 7: 星期一 ~ 星期天
  order         : {type: Number, default: 0}, //0: 休班 1: 早班 2: 中班 3: 晚班
  schedule_time : Date,
  creator       : {type: ObjectId, ref: 'Admin'},
  deleted       : {type: Boolean, default: false},
  update_time   : {type: Number, default: getTime },
  create_time   : {type: Date, default: Date.now}
});

module.exports = mongoose.model('DoctorScheduleItem', DoctorScheduleItemSchema);
