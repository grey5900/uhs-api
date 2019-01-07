/**
 * Created by isaac on 11/4/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var mongoosastic = require('mongoosastic');
import {getTime} from '../lib/util';

//医嘱
var OrderSchema = mongoose.Schema({

  record            : {type: ObjectId, ref: 'Record'}, //病历
  doctor            : {type: ObjectId, ref: 'Doctor', es_indexed: true}, //医嘱医生
  content           : {type: String, es_indexed: true},
  content_type      : String,
  start_time        : {type: Date, default: Date.now},
  end_time          : Date,
  // 临时医嘱
  temp_order        : [{
    treat_plan_id   : {type: ObjectId, ref: 'TreatPlan'},
    start_time      : Date,
    execute_time    : String,
    amount          : String,
    content         : String,
    content_type    : String,
    lab_sheets        : [String],
  }],
  drugs             : [{
    drug_id         : {type: ObjectId, ref: 'TreatPlan'},
    usage           : String, //用法
    amount          : String, //用量
    total           : String, //总量
    preserve        : String, //维持
    first_amount    : String //首剂
  }],
  type              : {type: String, enum: ['long', 'temp', 'dialysis'], default: 'dialysis'},
  //dialysis order content
  dialysis_order    : {
    month_dialysis  : Number, //本月血透总数
    week_dialysis   : Number, //本周血透总数
    week_filter     : Number, //本周血滤总数
    week_perfusion  : Number, //血灌次数
    SLED_num        : Number, //SLED次数
    CVVH_num        : Number,
    CVVHD_num       : Number,
    CVVHDF_num      : Number,

    supply          : {type: ObjectId, ref: 'DialysisSupply'},
    needle          : {type: ObjectId, ref: 'DialysisSupply'},
    perfusion       : {type: ObjectId, ref: 'DialysisSupply'},
    diagnosis       : String, // 诊断

    drug            : {type: ObjectId, ref: 'TreatPlan'},
    blood_flow      : String,
    //患者信息
    pre_weight      : String,  //透前体重    单位: kg
    post_weight     : String,  //透后体重    单位: kg
    pre_heartrate   : Number,  //透析前心率
    post_heartrate  : Number,  //透析后心率
    pre_high_bp     : Number,  //透析前收缩压
    post_high_bp    : Number,  //透析后收缩压
    pre_low_bp      : Number,  //透析前舒张压
    post_low_bp     : Number,  //透析后舒张压
    pre_water_mass  : String,  //预设超滤量, 单位: kg
    post_water_mass : String, //实际超滤量, 单位: kg
    duration        : String, //透析时间, 单位: 小时

    //有无出血
    blood           : [String],
    other_blood     : String, //其他出血

    //目前透析处方
    frequency       : String, // 频率
    time_a          : [String], // A周
    time_b          : [String], // B周

    pathType        : String,   //通路类型
    paths           : [String], //透析通路
    time            : String,
    dialyzer        : {type: ObjectId, ref: 'DialysisSupply'}, //透析器
    blood_flow2     : String,
    ktv             : String,
    anticoagulation : String, //抗凝
    urr             : String,

    noHeparin       : {
      treat_plan    : {type: ObjectId, ref: 'TreatPlan'},
      amount        : String,
      preserve      : String,
    },
    normalHeparin   : {
      treat_plan    : {type: ObjectId, ref: 'TreatPlan'},
      first         : String,
      preserve      : String,
      total         : String
    },
    lowHeparin      : {
      treat_plan    : {type: ObjectId, ref: 'TreatPlan'},
      first         : String,
      preserve      : String,
      total         : String
    },
    //目前相关治疗
    erythropoietin  : {
      treat_plan    : {type: ObjectId, ref: 'TreatPlan'},
      amount        : String
    },
    l_carnitine     : {
      treat_plan: {type: ObjectId, ref: 'TreatPlan'},
      amount        : String
    },
    dexamethasone   : {
      treat_plan: {type: ObjectId, ref: 'TreatPlan'},
      amount        : String
    }, //地塞米松
    saline          : String, //盐水
    folic_acid      : {type: ObjectId, ref: 'TreatPlan'},
    sheng_xue_ning  : {type: ObjectId, ref: 'TreatPlan'},
    iron_saccharate : {                                   // 蔗糖铁 / 铁剂
      treat_plan    : {type: ObjectId, ref: 'TreatPlan'},
      amount        : String
    },
    force           : {type: ObjectId, ref: 'TreatPlan'},
    vitamin_c       : {type: ObjectId, ref: 'TreatPlan'},
    vitamin_b12     : {type: ObjectId, ref: 'TreatPlan'},
  },
  yh_his            : {
    jzid: String, // 就诊ID
    jzh: String, // 就诊号
    kdys: String, // 开单医生
    kssj: String, // 开始时间
    yznr: String, // 医嘱内容
    jl: String, // 剂量
    dw: String, // 剂量单位
    fyl: String, //发药量
    fyldw: String // 发药单位
  },

  lab_sheets        : [String],
  lab_sheets_event  : [{type: ObjectId, ref: 'UserEvent'}],

  deleted           : {type: Boolean, default: false},
  create_time       : {type: Date, default: Date.now},
  update_time   : {type: Number, default: getTime },
});

OrderSchema.plugin(mongoosastic);
module.exports = mongoose.model('Order', OrderSchema);
OrderSchema.plugin(deepPopulate);
