/**
 * Created by isaac on 16/3/5.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../lib/util';

//诊断结果
var DiagnosisSchema = mongoose.Schema({

  patient        : {type: ObjectId, ref: 'Patient'},
  name           : String,
  level          : String,
  stage          : String,
  results        : [{
    radio_options: {
      name: String,
      options: [String]
    }, //单选的子项
    options      : [String], //可多选子项
    note         : String, //补充内容

    reference    : {type: ObjectId, ref: 'DiagnosisReference'}
  }],
  description    : String,
  attachments    : [{type: ObjectId, ref: 'File'}],
  creator        : {type: ObjectId, ref: 'Admin'},
  diagnosis_time : Date,
  update_time   : {type: Number, default: getTime },
  create_time    : {type: Date, default: Date.now},
  deleted        : {type: Boolean, default: false}
});

module.exports = mongoose.model('Diagnosis', DiagnosisSchema);