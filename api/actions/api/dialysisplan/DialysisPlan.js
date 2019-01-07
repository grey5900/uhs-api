/**
 * Created by isaac on 16/8/24.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
import {getTime} from '../../lib/util';

//透析治疗方案
var DialysisPlanSchema = mongoose.Schema({
  patient         : {type: ObjectId, ref: 'Patient'},
  doctor          : {type: ObjectId, ref: 'Doctor'},

  path_type        : String,   //通路类型
  paths           : [String], //透析通路

  start_time      : Number, // 开始时间
  end_time        : Number, // 结束时间

  month_dialysis  : Number, //本月血透总数
  week_dialysis   : Number, //本周血透总数
  week_filter     : Number, //本周血滤总数
  week_perfusion  : Number, //血灌次数

  dialyzer        : {type: ObjectId, ref: 'DialysisSupply'}, // 透析器
  needle          : {type: ObjectId, ref: 'DialysisSupply'}, // 穿刺针
  perfusion       : {type: ObjectId, ref: 'DialysisSupply'}, //

  diagnosis       : String, // 诊断
  diseases        : [String], // 医保病种
  items           : [{
    drug          : {type: ObjectId, ref: 'Drug'}, // 药品
    supply        : {type: ObjectId, ref: 'DialysisSupply'}, // 耗材
    sheettype     : {type: ObjectId, ref: 'SheetType'}, // 检查类型
    disease       : String,                        // 所属病种
    usage         : String,                        // 用法
    amount        : String,                        // 用量
    cycle         : Number,                        // 周期
  }],
  deleted         : {type: Boolean, default: false},
  update_time     : {type: Number, default: getTime},
  create_time     : {type: Number, default: getTime}
});

module.exports = mongoose.model('DialysisPlan', DialysisPlanSchema);

DialysisPlanSchema.plugin(deepPopulate, {});
