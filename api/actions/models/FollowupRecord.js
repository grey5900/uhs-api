/**
 * Created by chris Lin Chen on 16/3/10.
 */
var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var ObjectId = mongoose.Schema.Types.ObjectId;
var mongoosastic = require('mongoosastic');
import {getTime} from '../lib/util';

//随访记录·
var FollowupRecordSchema = mongoose.Schema({

  //相关信息
  patient       : {type: ObjectId, ref: 'Patient', es_indexed: true},
  doctor        : {type: ObjectId, ref: 'Doctor'},
  hospital      : {type: ObjectId, ref: 'Hospital'},

  first_visit   : Boolean,
  //评估
  evaluation    : String,
  evaluate_items: [{name: String, result: String}],

  //随访日期
  date          : Date,
  next_appointment : {type: ObjectId, ref: 'UserEvent'},
  //随访类型:
  type          : {type: String, enum: ['tel', 'outpatient', 'inpatient', 'home' ], es_indexed: true},

  //腹透随访的信息
  peritoneal    : {
    height : Number,
    weight : Number,
    target_weight: Number,
    //腹围
    girth: Number,
    blood_pressure_low: Number,
    blood_pressure_high: Number,
    //一天尿量
    urine_one_day: Number,
    // 干腹，留腹
    peritoneal_type: {type: String, enum: ['dry', 'left']},
    // 浮肿
    edema: String,
    // 引流灌入通常度
    irrigation: String,
    // 导管清洁度
    tube_clean: String,
    //基础情况备注report_time
    basic_comment: String,
    // 食欲，营养，精神，睡眠
    appetite: String,
    breakfast: Number,
    lunch: Number,
    dinner: Number,
    nutrition: String,
    spirit: String,
    sleep: String,
    sleep_time: Number,
    // 症状体征（心血管，呼吸，消化，泌尿）
    cardiovascular_symptoms: [String],
    cardiovascular_symptoms_other: [String],
    breath_symptoms: [String],
    breath_symptoms_other: [String],
    digestion_symptoms: [String],
    digestion_symptoms_other: [String],
    urinary_symptoms: [String],
    urinary_symptoms_other: [String],
    other_symptoms: [String],
    //腹膜透析相关状况
    condition: [String],
    condition_other: [String],
    // 出口感染
    exit_infection: String,
    // 隧道口炎
    tunnel_infection: String,
    // 腹膜炎，腹膜炎症状
    peritonitis: Boolean,
    peritonitis_symptoms: [String],
    peritonitis_symptoms_other: [String],
    //透出液常规（白细胞，分叶，细菌计数）
    leucocyte: Number,
    lobulation: Number,
    bacteria: Number,
    //析出液培养，阴性，阳性
    out_liquid: String,
    //腹膜炎腹腔治疗
    peritonitis_treatment_abdomen: String,
    //静脉治疗
    peritonitis_treatment_vein: String,
    //口服治疗
    peritonitis_treatment_oral: String,
    // 预后(治疗时长，转归)
    treatment_time: Number,
    outcome: String,
    // 更换短管
    replace_tube: Boolean,
    //　贫血 (血红蛋白，红细胞计数，网织红细胞计数，铁蛋白，转铁蛋白饱和度)
    hemoglobin: Number,
    erythrocyte: Number,
    granulofilocyte: Number,
    ferritin: Number,
    transferin_saturation: Number,
    // 骨矿物质代谢（矫正钙，血磷，iPTH, AKP, CO2-CP）
    correct_calcium: Number,
    blood_phosphorus: Number,
    ipth: Number,
    akp: Number,
    co2cp: Number,
    //营养评估 血白蛋白　前白蛋白 SGA, BMI
    albumin: Number,
    prealbumin: Number,
    sga: Number,
    bmi: Number,
    assess_other: String,
    //血生化指标 血纳　血钾　血氯　血糖餐前，餐后）糖化血红蛋白 甘油三酯 总胆固醇 低密度脂蛋白 高密度脂蛋白
    na: Number,
    kalium: Number,
    chlorine: Number,
    glucose: Number,
    glucose_time: {type: String, enum: ['empty', 'full']},
    glucose_hemoglobin: Number,
    triglyceride: Number,
    cholesterol: Number,
    low_density_lipoprotein: Number,
    high_density_lipoprotein: Number,
    //溶质、水分清除及残肾功能评估: eGFR 腹膜转运功能 一周总Kt/V 腹膜透析Kt/V 残肾Kt/V 一周总CCr 腹膜透析CCr 残肾CCr 腹膜透析超滤量 血尿素 肌酐 尿酸 β2微球蛋白
    egfr: String,
    peritoneal_transport: String,
    week_kv: String,
    peritoneal_kv: String,
    left_kv: String,
    week_ccr: String,
    peritoneal_ccr: String,
    left_ccr: String,
    peritoneal_uf: Number,
    blood_urea: Number,
    creatinine: Number,
    uric_acid: Number,
    b2_microglobulin: Number,
    //传染病指标
    hbsag: String,
    hbsab: String,
    hbeag: String,
    hbeab: String,
    hbcab: String,
    hbvdna: String,
    hcv: String,
    hcvrna: String,
    hiv: String,
    syphilis: String,
    disease_other: String,
    //金葡菌筛查 鼻子拭子
    nose_swab: String,
    //炎症状态 crp 血沉
    crp: Number,
    esr: Number,
    //心肺检查 心电图  心脏彩超 颈动脉彩超 胸片
    electrocardiogram: String,
    heart_ultrasound: String,
    carotid_ultrasound: String,
    rabat: String,
    other_check: String,
    //用药情况 降压药 ARB/ACEI类 CCB类 利尿药 β/α受体阻滞药 铁剂 促红素 降磷药物 活性维生素D
    arb_acei: String,
    ccb: String,
    diuretics: String,
    blocker: String,
    iron: String,
    erythropoietin: String,
    low_phosphor: String,
    active_vd: String,
    other_drug: String,
    //回归社会情况
    back_society: [String],
    //是否住院
    in_hospital: Boolean,
    //评估结论
    conclusion: String,
    //下一步诊疗计划
    next_plan: String
  },

  //家庭随访信息
  home          : {
    height        : String,
    time          : String,

    current_weight: String,
    blood_pressure: String,
    day_ufr       : String,
    day_water     : String,
    day_urine     : String,
    day_sport     : String,
    weight_record : String,
    blood_pressure_record: String,
    urine_record  : String,
    water_record  : String,
    ufr_record    : String,

    options       : [String],
    note          : String
  },

  //随访周期
  period        : String,
  //随访计划表
  plan          : String,
  symptoms      : [String],

  //7种化验单的最新化验结果
  sheets        : {type: ObjectId, ref: 'Sheet'},
  //医嘱
  order         : {type: ObjectId, ref: 'Order'},
  //诊断
  diagnosis     : {type: ObjectId, ref: 'Diagnosis'},
  //处方
  prescription  : {type: ObjectId, ref: 'Prescription'},

  creator       : {type: ObjectId, ref: 'Admin', es_indexed: true},
  deleted       : {type: Boolean, default: false},
  create_time   : {type: Date, default: Date.now},
  update_time   : {type: Number, default: getTime },
});

FollowupRecordSchema.plugin(mongoosastic);
module.exports = mongoose.model('FollowupRecord', FollowupRecordSchema);

FollowupRecordSchema.plugin(deepPopulate, {
  populate: {
    'prescription': {
      match: {deleted: false}
    },
    'prescription_drug': {
      match: {deleted: false}
    }
  }
});
