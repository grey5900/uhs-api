/**
 * Created by yons on 16/3/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../lib/util';

//诊断类型
var DiagnosisTypeSchema = mongoose.Schema({

  name         : String, //名称
  references   : [{type: ObjectId, ref: 'DiagnosisReference'}],

  creator      : {type: ObjectId, ref: 'Admin'},
  deleted      : {type: Boolean, default: false},
  update_time   : {type: Number, default: getTime },
  create_time  : {type: Date, default: Date.now}
});

module.exports = mongoose.model('DiagnosisType', DiagnosisTypeSchema);
