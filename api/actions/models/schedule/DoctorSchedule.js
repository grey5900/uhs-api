/**
 * Created by isaac on 2016/3/21.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
import {getTime} from '../../lib/util';

//医护排班模板
var DoctorScheduleSchema = mongoose.Schema({

  name          : String,
  order         : {type: Number, enum: [1, 2, 3, 4]}, //1 ~ 4: 第一 ~ 四周
  items         : [{type: ObjectId, ref: 'DoctorScheduleItem'}],
  time          : String,
  type          : String,
  schedule_date : {type: Date, default: null},  // 排班生效的日期
  schedule_week : String,

  is_template   : {type: Boolean, default: false},

  hospital      : {type: ObjectId, ref: 'Hospital'},
  creator       : {type: ObjectId, ref: 'Admin'},
  deleted       : {type: Boolean, default: false},
  update_time   : {type: Number, default: getTime },
  create_time   : {type: Date, default: Date.now}
});

module.exports = mongoose.model('DoctorSchedule', DoctorScheduleSchema);
DoctorScheduleSchema.plugin(deepPopulate);