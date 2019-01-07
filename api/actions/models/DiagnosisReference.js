/**
 * Created by yons on 16/3/14.
 */
var mongoose = require('mongoose');
import {getTime} from '../lib/util';

//诊断条目参考
var DiagnosisReferenceSchema = mongoose.Schema({

  name         : String, //参考项目名称
  radio_options: [{
    name: String,
    options: [String]
  }], //互斥的子项
  options      : [{
    name: String,
    options: [String]
  }], //可多选子项
  note         : String, //补充内容

  deleted         : {type: Boolean, default: false},
  update_time   : {type: Number, default: getTime },
  create_time  : {type: Date, default: Date.now}
});

module.exports = mongoose.model('DiagnosisReference', DiagnosisReferenceSchema);
