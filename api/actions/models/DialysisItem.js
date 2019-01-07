/**
 * Created by isaac on 2016/4/1.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
import {getTime} from '../lib/util';

//日常透析
var DialysisItemSchema = mongoose.Schema({

  patient       : {type: ObjectId, ref: 'Patient'},
  status        : {type: Number, enum: [
    0, // 未签到
    1, //已签到
    2, //已上机
    3, //暂停
    4  //已下机
  ]},
  pre_weight    : String,  //透前体重    单位: kg
  post_weight   : String,  //透后体重    单位: kg
  pre_heartrate : Number,  //透析前心率
  post_heartrate: Number,  //透析后心率
  pre_high_bp   : Number,  //透析前收缩压
  post_high_bp  : Number,  //透析后收缩压
  pre_low_bp    : Number,  //透析前舒张压
  post_low_bp   : Number,  //透析后舒张压
  pre_water_mass: String,  //预设超滤量, 单位: kg
  post_water_mass: String, //实际超滤量, 单位: kg
  duration      : {type: Number, default: 0}, //透析时间, 单位: 分钟
  treat_methods : {type: String, default: ''}, //治疗方式
  pathType      : {type: String, default: ''},
  paths         : [String], //透析通路
  // 本次用药
  drugs         : [{
    drug        : {type: ObjectId, ref: 'Drug'}, // 药
    disease     : String,                        // 所属病种
    amount      : String,                        // 用量
    cycle       : Number,                        // 周期
    current_amount: String                         // 本次用量
  }],
  long_term_order: {type: ObjectId, ref: 'Order'}, //长期医嘱
  temp_order    : {type: ObjectId, ref: 'Order'}, //临时医嘱
  machineInfo   : {
    // model: String, //透析机型号
    dialyser_type: {type: ObjectId, ref: 'DialysisSupply'}, //透析器类型

    allergy: String, //透析器过敏
    change_dialyser: Boolean, //更换透析器?
    change_reason  : String, //更换原因
    old_dialyser_type: {type: ObjectId, ref: 'DialysisSupply'},
    new_dialyser   : {type: ObjectId, ref: 'DialysisSupply'}, //更换透析器
    change_path    : String, //更换管路
    change_count   : Number, //更换次数
    concentration  : String, //消毒液浓度
    remain         : String, //消毒液残留
    disinfection_type: String, //消毒类型
    note           : String, //备注
  },

  samples : [{     //观察记录
    create_time: Date,
    bp_high    : Number, //血压 高
    bp_low     : Number, //血压 低
    pulse      : Number, //脉搏/心率
    temperature: {type: String, default: ''}, //体温
    bf         : {type: String, default: ''}, //血流量
    trans_pressure: Number, //跨膜压
    venous_pressure: Number, //静脉压
    conductivity   : Number, //电导度
    heparin        : {type: String, default: ''}, //肝素
    water_mass     : {type: String, default: ''}, //超滤量
  }],
  accident      : [String], //不良事件
  other_accident: {type: String, default: ''}, //其它不良事件
  schedule      : {type: ObjectId, ref: 'PatientScheduleItem'},
  creator       : {type: ObjectId, ref: 'Admin'},
  deleted       : {type: Boolean, default: false},
  last_start_time: Date, // 为计算暂停时间
  update_time   : {type: Number, default: getTime },
  create_time   : {type: Number, default: getTime }
});

module.exports = mongoose.model('DialysisItem', DialysisItemSchema);

DialysisItemSchema.plugin(deepPopulate, {});
