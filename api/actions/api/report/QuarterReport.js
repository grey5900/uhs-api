/**
 * Created by isaac on 16/9/7.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../../lib/util';

var QuarterReportSchema = mongoose.Schema({
  patient     : {type: ObjectId, ref: 'Patient'},
  doctor      : {type: ObjectId, ref: 'Doctor'},
  hospital    : {type: ObjectId, ref: 'Hospital'},

  protopathy  : String, // 原发病
  dialysis_ages : Number, // 透析龄
  path        : String, // 血管通路
  ktv         : Number, // Kt/V
  urr         : Number, // URR

  urine_volume: Number, // 24小时尿量
  gfr         : String, // GFR
  creatinine  : String, // 透前肌酐

  // 血压&超滤评估
  blood_pressures: [{
    time      : String, // 月份
    pre_high_bp: Number, // 透前收缩压
    pre_low_bp: Number, // 透前舒张压
    post_high_bp: Number, // 透后收缩压
    post_low_bp: Number, // 透后舒张压
    volume    : Number,  // 超滤量
    dry_mass  : Number, // 干体重
  }],

  // 体格
  bcm         : Number,  // BCM
  height      : Number,  // 身高
  weight      : Number,  // 体重
  bmi         : Number, // BMI
  oh          : Number, // 水负荷
  tbw         : Number, // 全身水量
  fti         : Number, // 脂肪指数
  lti         : Number, // 肌肉指数

  // 肾性贫血评估
  hemoglobin  : String, // 血红蛋白
  rbc         : String, //红细胞压积
  ferritin    : String, // 铁蛋白
  transferin_saturation: String, // 转铁蛋白饱和度

  // 促红素
  epo         : {
    interval  : String, // 用药间隔
    amount    : String, // 剂量
    week_amount: String, // 一周剂量
    start_time: String, // 开始时间
  },

  // 铁剂
  fe         : {
    interval  : String, // 用药间隔
    amount    : String, // 剂量
    week_amount: String, // 一周剂量
    start_time: String, // 开始时间
  },

  //CKD-MBD评估
  ca        : String, // 钙
  phosphorus: String, // 磷
  ipth      : String, // iPTH

  // 醋酸钙
  calcium_acetate : {
    amount : String, // 剂量
    usage  : String, // 用法
    start_time: String, // 开始时间
  },

  // 骨化三醇
  calcitriol : {
    amount : String, // 剂量
    usage  : String, // 用法
    start_time: String, // 开始时间
  },

  albumin     : String,  // 白蛋白
  prealbumin  : String, // 前白蛋白
  triglyceride: String, // 甘油三脂
  cholesterol : String, //胆固醇
  ldl         : String, //LDL 低密度脂蛋白
  hdl         : String, //HDL 高密度脂蛋白
  blood_sugar : String, // 空腹血糖
  ghbaic      : String, // 糖化血红蛋白
  crp         : String, // CRP(C反应蛋白)

  infection   : String, //传染病九项
  ka          : String, // 血钾
  beta2       : String, // beta2微球蛋白

  bad_events  : String, // 不良事件
  dry_mass    : String, // 干体重
  comment     : String, // 备注

  update_time : {type: Number, default: getTime},
  create_time : {type: Number, default: getTime},
});

module.exports = mongoose.model('QuarterReport', QuarterReportSchema);
