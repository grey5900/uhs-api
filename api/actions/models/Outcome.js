/**
 * Created by isaac on 16/8/13.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var mongoosastic = require('mongoosastic');
import {getTime} from '../lib/util';

var OutcomeSchema = mongoose.Schema({
  patient       : {type: ObjectId, ref: 'Patient'},

  lapse         : String, //转归情况
  quit          : String, //退出情况
  quit_other    : String, //其他退出情况
  roll_address  : String, //转出地点
  roll_reason   : String, //转出原因
  roll_other    : String, //其他转出原因
  dead_reason   : String, //死亡原因
  cardiovascular: String, //心血管事件
  cardiovascular_other: String, //其他心血管事件
  brain         : String, //脑血管事件
  brain_other   : String, //其他脑血管事件
  infect        : String, //感染
  infect_other  : String, //其他感染
  dead_other    : String, //其他死亡原因

  creator       : {type: ObjectId, ref: 'Admin'},
  deleted       : {type: Boolean, default: false},
  create_time   : {type: Number, default: getTime },
  update_time   : {type: Number, default: getTime },
});

OutcomeSchema.plugin(mongoosastic);
module.exports = mongoose.model('Outcome', OutcomeSchema);
