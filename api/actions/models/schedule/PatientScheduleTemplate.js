/**
 * Created by isaac on 16/4/30.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
import {getTime} from '../../lib/util';

//患者排班模板
var PatientScheduleTemplateSchema = mongoose.Schema({

  name          : String,
  odd_items     : [{type: ObjectId, ref: 'PatientScheduleItem'}], // 1-3-5
  even_items    : [{type: ObjectId, ref: 'PatientScheduleItem'}], // 2-4-6
  is_current    : {type: Boolean, default: false},
  hospital      : {type: ObjectId, ref: 'Hospital'},
  creator       : {type: ObjectId, ref: 'Admin'},
  deleted       : {type: Boolean, default: false},
  schedule_time : {type: Date},
  update_time   : {type: Number, default: getTime },
  create_time   : {type: Date, default: Date.now}
});

module.exports = mongoose.model('PatientScheduleTemplate', PatientScheduleTemplateSchema);
PatientScheduleTemplateSchema.plugin(deepPopulate);