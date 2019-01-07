/**
 * Created by chris on 12/3/15.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../lib/util';

// 透析机器
var DialysisMachineSchema = mongoose.Schema({

  index: Number, //机器号
  bed_index: String, //床位号

  //FIXME 透析机型号, those 3 fields are deprecated!!!
  brand: String,
  model: String,
  type: {type: String, default: 'HD'}, // HD or HDF

  brand_reference: {type: ObjectId, ref: 'MachineBrand'},

  area: {type: String, default: 'A'}, // 0: A or 1 : B
  infectious_disease: {type: ObjectId, ref: 'DiseaseType'}, //B区传染病的类型。
  status: {
    type: Number,
    enum: [
      0, //正常
      1, //故障
      2, //维修中
      3  //停用
    ],
    default: 0
  },
  disinfect: {
    type: Number,
    enum: [
      0, //未消毒
      1, //消毒中
      2 //已消毒
    ],
    default: 0
  },
  preflush: {
    type: Number,
    enum: [
      0, //未预冲
      1, //预冲中,
      2 //预冲完成
    ],
    default: 0
  },
  history_info: [{
    time: {type: Date, default: Date.now},
    reason: String,
    repairman: String,
    note: String
  }],

  note: String,
  hospital: {type: ObjectId, ref: 'Hospital'},
  create_time: {type: Date},
  update_time   : {type: Number, default: getTime },
  deleted: {type: Boolean, default: false},
});

module.exports = mongoose.model('DialysisMachine', DialysisMachineSchema);
