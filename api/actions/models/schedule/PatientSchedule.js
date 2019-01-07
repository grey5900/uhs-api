/**
 * Created by isaac on 2016/3/21.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
import {getTime} from '../../lib/util';

//患者排班
var PatientScheduleSchema = mongoose.Schema({

  monday_items    : [{type: ObjectId, ref: 'PatientScheduleItem'}],
  tuesday_items   : [{type: ObjectId, ref: 'PatientScheduleItem'}],
  wednesday_items : [{type: ObjectId, ref: 'PatientScheduleItem'}],
  thursday_items  : [{type: ObjectId, ref: 'PatientScheduleItem'}],
  friday_items    : [{type: ObjectId, ref: 'PatientScheduleItem'}],
  saturday_items  : [{type: ObjectId, ref: 'PatientScheduleItem'}],

  template      : {type: ObjectId, ref: 'PatientScheduleTemplate'},
  schedule_date : {type: Date, default: null},  // 排班生效的日期
  schedule_week : String,

  hospital      : {type: ObjectId, ref: 'Hospital'},
  creator       : {type: ObjectId, ref: 'Admin'},
  deleted       : {type: Boolean, default: false},
  update_time   : {type: Number, default: getTime },
  create_time   : {type: Date, default: Date.now}
});

module.exports = mongoose.model('PatientSchedule', PatientScheduleSchema);
PatientScheduleSchema.plugin(deepPopulate);