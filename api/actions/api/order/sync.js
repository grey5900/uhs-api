/**
 * Created by isaac on 16/7/13.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {syncTreatplan} from '../treatplan/sync';
const Hospital = mongoose.model('Hospital');
const Patient = mongoose.model('Patient');
const Record = mongoose.model('Record');
const Order = mongoose.model('Order');
const TreatPlan = mongoose.model('TreatPlan');
const Meta = mongoose.model('Meta');
const kTempOrderSyncKey = 'meta.options.sync.order.temp';

// field map
const fm = {
  yzid: 0, //医嘱ID
  jzid: 1, // 就诊ID
  jzh: 2, // 就诊号
  kdys: 3, // 开单医生
  kssj: 4, // 开始时间
  yznr: 5, // 医嘱内容
  jl: 6, // 剂量
  dw: 7, // 剂量单位
  fyl: 8, //发药量
  fyldw: 9 // 发药单位
};

function mapToOrder(obj) {
  return {};
}

function mapToHis(obj) {
  return {
    yzid: obj[fm.yzid], //医嘱ID
    jzid: obj[fm.jzid], // 就诊ID
    jzh: obj[fm.jzh], // 就诊号
    kdys: obj[fm.kdys], // 开单医生
    kssj: obj[fm.kssj], // 开始时间
    yznr: obj[fm.yznr], // 医嘱内容
    jl: obj[fm.jl], // 剂量
    dw: obj[fm.dw], // 剂量单位
    fyl: obj[fm.fyl], //发药量
    fyldw: obj[fm.fyldw] // 发药单位
  };
}

export function syncOrder(result, record, resolve, reject) {
  const {rows} = result;
  if (rows.length > 0) {
    //
    rows.forEach((item) => {
      const newOrder = new Order();
      newOrder.type = 'temp';
      newOrder.record = record;
      newOrder.temp_order.push({
        execute_time: item[fm.kssj],
        amount: item[fm.jl],
        content: item[fm.yznr]
      });
      newOrder.yh_his = mapToHis(item);
      newOrder.save((error) => {
        console.log(error);
      });
    });
    resolve({code: config.code.success});
  } else {
    resolve({code: config.code.success});
  }
}

export default function (req, params, ctx) {
  const {jzh, record} = req.query;
  return new Promise((resolve, reject) => {

    Meta.findOne({name: kTempOrderSyncKey}, (error, meta) => {
      let sync_time = null;
      if (meta) {
        sync_time = meta.sync_time;
      } else {
        /// FIXME: what is the first sync time???
        sync_time = new Date();
      }
      const {his: {sync, connection}} = ctx;
      sync.order(connection, sync_time, jzh).then((result) => syncOrder(result, record, resolve, reject),
        (error) => {
          console.log(error);
          reject({msg: '同步患者失败!'});
        });
    });
  });
}
