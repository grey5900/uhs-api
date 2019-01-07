/**
 * Created by isaac on 16/7/10.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../lib/util';


var TreatPlanSchema = mongoose.Schema({
  faid        : String,
  jzh         : String, //  就诊号
  medicare_number : String, // 医保项目编码
  hospital_number : String, // 医院项目编码
  hospital_type   : Number, // 医院项目类型 1. 药品 2. 诊疗
  item_name   : String, // 医院项目名称
  usage       : String, // 用法
  amount      : Number, // 用量
  period      : Number, // 用药周期
  price_number: String, // 物价编码
  disease_number: String, // 病种编码
  total       : Number, //总量
  used        : Number, //已用
  yb_total    : Number, //医保可用量
  yf_total    : Number, //药房可用量

  creator     : {type: ObjectId, ref: 'Admin'},
  create_time : {type: Date, default: Date.now},
  update_time   : {type: Number, default: getTime },
  deleted     : {type: Boolean, default: false}
});

module.exports = mongoose.model('TreatPlan', TreatPlanSchema);
