/**
 * Created by isaac on 16/7/10.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Patient = mongoose.model('Patient');
const TreatPlan = mongoose.model('TreatPlan');

// field map
const fm = {
  faid: 0, // 方案ID
  c_pat_id: 1, // 患者ID
  jzh: 2, //就诊号
  ybxmbm: 3, //医保项目编码
  yyxmbm: 4, //医院项目编码
  yyxmlx: 5, //医院项目类型（1：药品；2、诊疗）
  yyxmmc: 6, //医院项目名称
  yf: 7, //用法
  yl: 8, //用量
  yyzq: 9, //用药周期
  wjbm: 10, //物价编码
  bzbm: 11, //病种编码
  zl: 12, //总量
  yyl: 13, //已用量
  ybkyl: 14, //医保可用量
  yfkyl: 15, // 药房可用量
};

export function mapToTreatPlan(obj) {
  return {
    faid: obj[fm.faid],
    jzh: obj[fm.jzh], //  就诊号
    medicare_number: obj[fm.ybxmbm], // 医保项目编码
    hospital_number: obj[fm.yyxmbm], // 医院项目编码
    hospital_type: obj[fm.yyxmlx], // 医院项目类型 1. 药品 2. 诊疗
    item_name: obj[fm.yyxmmc], // 医院项目名称
    usage: obj[fm.yf], // 用法
    amount: obj[fm.yl], // 用量
    period: obj[fm.yyzq], // 用药周期
    price_number: obj[fm.wjbm], // 物价编码
    disease_number: obj[fm.bzbm], // 病种编码
    total: obj[fm.zl],
    used: obj[fm.yyl],
    yb_total: obj[fm.ybkyl],
    yf_total: obj[fm.yfkyl]
  };
}

export function syncTreatplan(jzh, obj, resolve, reject) {
  const {rows} = obj;
  if (rows.length > 0) {
    Patient.findOne({jzh}, (error, patient) => {
      if (error) {
        console.log(error);
        reject({msg: error.message});
      } else if (patient) {
        // sync treat plan of patient
        const plans = patient.treat_plans;
        if (plans && plans.length > 0) {
          // remove old plans
          plans.forEach((planLooper) => TreatPlan.findOneAndUpdate({_id: planLooper}, {deleted: true}, (error) => {
            if (error) {
              console.log(error);
            }
          }));
        }
        patient.treat_plans = [];

        //create new plans
        //
        rows.forEach((rowLooper) => {
          const newPlan = new TreatPlan(mapToTreatPlan(rowLooper));
          newPlan.save();
          patient.treat_plans.push(newPlan);
        });
        patient.save((error) => {
          if (error) {
            console.log(error);
            reject({msg: error.message});
          } else {
            resolve({msg: '同步治疗方案完成!'});
          }
        });
      } else {
        resolve({msg: '就诊号对应的患者不存在!'});
      }
    });
  } else {
    resolve({msg: '就诊号对应的治疗方案不存在!'});
  }
}

export default function (req, params, ctx) {
  const {jzh} = req.query;
  return roleAuthPromise(req, 'update', 'TreatPlan', (resolve, reject) => {
    if (jzh) {
      const {his: {sync, connection}} = ctx;
      sync.plan(connection, jzh).then((obj) => syncTreatplan(jzh, obj, resolve, reject),
        (error) => {
          console.log(error);
          reject({msg: '同步治疗方案失败!'});
        });
    } else {
      reject({msg: '缺少参数!'});
    }
  });
}
