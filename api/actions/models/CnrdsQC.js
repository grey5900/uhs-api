/*
 * Copyright(c) omk 2016
 * Filename: CnrdsQC.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期三,  7 九月 2016.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../lib/util';

var CnrdsQCSchema = mongoose.Schema({

  patient       : {type: ObjectId, ref: 'Patient'},
  year          : Number,
  quarter       : {type: Number, enum: [1, 2, 3, 4]}, //季度
  adequacy_date : Date,/* 日期 */
  ktv           : String, /* Kt/V */
  urr           : String, /* URR */
  height        : String,
  weight        : String,
  bmi           : String,
  primary_disease : String,
  path          : String,
  monthly       : [{    /* 每月血压测量和干体重 */
    month       : Number,
    pre_high    : String,
    post_high   : String,
    pre_low     : String,
    post_low    : String,
    dry_weight  : String,
  }],

  //examine
  creatinine      : String, /* 肌酐 */
  red_blood       : String, /* 血红蛋白 */
  red_pressure    : String,/* 红细胞压积 */
  iron            : String,/* 铁蛋白 */
  ipth            : String,/* iPTH */
  iron_saturation : String,/* 转铁蛋白饱和度 */
  calcium         : String,/* 血钙 */
  phosphorus      : String,/* 血磷 */
  albumin         : String,/* 白蛋白 */
  triglyceride    : String,/* 甘油三酯 */
  cholesterol     : String,/* 胆固醇 */
  ldl             : String,/* LDL低密度脂肪 */
  hdl             : String,/* HDL高密度脂肪 */
  sugar           : String,/* 空腹血糖 */
  crp             : String,/* CRP C反应蛋白 */
  kalium          : String,/* 血钾 */
  b2_globin       : String,/* b2 微球蛋白 */
  epo           : {/* EPO, 促红素 */
    interval    : String,
    dosage      : String,
    start_time  : String
  },
  iron_drug     : {/* 铁剂 */
    interval    : String,
    dosage      : String,
    start_time  : String
  },
  acid_calcium  : {/* 醋酸钙 */
    dosage      : String,
    usage       : String,
    start_time  : String,
  },
  calcitriol  : {/* 骨化三醇 活性维生素D */
    dosage      : String,
    usage       : String,
    start_time  : String,
  },
  creator       : {type: ObjectId, ref: 'Admin'},
  deleted       : {type: Boolean, default: false},
  update_time   : {type: Number, default: getTime },
  create_time   : {type: Date, default: Date.now}
});

module.exports = mongoose.model('CnrdsQC', CnrdsQCSchema);

