/*
 * Copyright(c) omk 2016
 * Filename          : KidneyBasic.js
 * Author            : Lin Chen <lc@omk.io>
 * Create            : 星期四,  7 七月 2016.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../lib/util';

//肾功基础
var KidneyBasicSchema = mongoose.Schema({

  patient            : {type: ObjectId, ref: 'Patient'},
  ckd_stage          : String,
  dry_weight         : Number,
  creatinine         : String, //肌酐
  urea               : String, //尿素
  urea_acid          : String, //尿酸
  pth                : String,
  protein            : String, //24小时尿蛋白定量
  protein_creatinine : String,// 尿蛋白肌酐比值
  creatinine_clean   : String, //内生肌酐清除率
  hematochrome       : String, //血色素

  creator            : {type: ObjectId, ref: 'Admin'},

  create_time        : {type: Date, default: Date.now},
  update_time   : {type: Number, default: getTime },
  deleted            : {type: Boolean, default: false}
});

module.exports = mongoose.model('KidneyBasic', KidneyBasicSchema);
