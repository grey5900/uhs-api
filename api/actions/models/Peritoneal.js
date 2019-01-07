/**
 * Created by jiang_mac on 16/5/11.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../lib/util';

//腹膜
var PeritonealSchema = mongoose.Schema({
  patient        : {type: ObjectId, ref: 'Patient'},
  diagnose       : String, //诊断
  reason         : [String], //病因诊断
  merge          : [String], //合并症状
  infect         : [String], //传染病筛查
  kidney         : String, //既往肾脏治疗史
  conduit        : [String], //腹膜透析导管类型
  handler        : [String], //腹膜透析操作者
  peritonitis    : String, //腹膜炎史
  exit           : [String], //退出腹膜透析原因
  lapse          : [String], //转归
  reason_other   : String, //诊断其他
  merge_other    : String, //其他神经病变
  infect_other   : String, //传染其他
  hd             : String, //HD年龄
  transplant     : String, //肾移植年龄
  conduit_other  : String, //腹膜导管类型其他
  handler_other  : String, //操作者其他
  count          : String, //发生次数
  exit_other     : String, //退出腹膜原因其他
  die_reason     : String, //死亡原因
  update_time   : {type: Number, default: getTime },
});

module.exports = mongoose.model('Peritoneal', PeritonealSchema);
