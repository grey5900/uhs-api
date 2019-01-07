/**
 * Created by chris on 12/3/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var mongoosastic = require('mongoosastic');
import {getTime} from '../lib/util';

var DialysisSupplySchema = mongoose.Schema({

  //耗材
  code            : String, //耗材编码
  name            : {type: String, es_indexed: true}, //耗材名称
  english_name    : String,
  cost_name       : String, //费用名
  price           : String, //购入价
  retail_price    : Number, //零售价
  provider        : {type: String, es_indexed: true}, //生产厂商
  spec_store      : String, //仓库规格
  unit_store      : String, //仓库单位
  pack            : String, //包装
  spec_room       : String,
  unit_room       : String, //药房规格和单位
  valid_month     : Number, //多少个月有效期
  manufact_method : String, //制造方式
  approval        : String, //批准文号
  health_perm     : String, //卫生许可证号
  comment         : String, //备注
  create_time     : {type: Date, default: new Date()},
  deleted         : {type: Boolean, default: false},

  hospital        : {type: ObjectId, ref: 'Hospital'},
  update_time   : {type: Number, default: getTime },
});

DialysisSupplySchema.plugin(mongoosastic);
module.exports = mongoose.model('DialysisSupply', DialysisSupplySchema);
