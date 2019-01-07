/**
 * Created by isaac on 16/6/22.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var mongoosastic = require('mongoosastic');
import {getTime} from '../lib/util';

//诊断结果
var KidneyDiagnosisSchema = mongoose.Schema({

  patient        : {type: ObjectId, ref: 'Patient', es_indexed: true},
  diagnosis_time : Date,
  level          : {type: String, es_indexed: true},
  stage          : {type: String, es_indexed: true},
  results        : [{
    name         : String,
    options      : [String], // 多选子项
    note         : String,   // 补充内容
  }],
  description    : String,
  category       : String,  // 原发病诊断分类
  category_note  : String,  // 原发病诊断分类-其它

  creator        : {type: ObjectId, ref: 'Admin'},

  create_time    : {type: Date, default: Date.now},
  update_time   : {type: Number, default: getTime },
  deleted        : {type: Boolean, default: false}
});
KidneyDiagnosisSchema.plugin(mongoosastic);
module.exports = mongoose.model('KidneyDiagnosis', KidneyDiagnosisSchema);