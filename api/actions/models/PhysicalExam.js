/**
 * Created by yons on 16/3/12.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../lib/util';

// 体格检查
var PhysicalExamSchema = mongoose.Schema({

  patient     : {type: ObjectId, ref: 'Patient'},
  height      : {type: Number},
  weight      : {type: Number},
  girth       : {type: Number}, // 腰围
  hip         : {type: Number}, // 臀围
  skin_thick  : {type: Number}, // 皮褶厚度
  heart_rate  : {type: Number}, // 心率
  blood_pressure_high: {type: Number}, // 血压高压
  blood_pressure_low:  {type: Number}, // 血压低压

  exam_time   : {type: Date, default: Date.now}, // 检查时间
  conclusion  : {type: String}, //评估结论
  period      : {type: String}, //周期

  creator     : {type: ObjectId, ref: 'Admin'},
  deleted     : {type: Boolean, default: false},
  create_time : {type: Date, default: Date.now},
  update_time   : {type: Number, default: getTime },
});

module.exports = mongoose.model('PhysicalExam', PhysicalExamSchema);
