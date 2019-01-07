/**
 * Created by Grey on 16/6/23.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../lib/util';

// 机器品牌
var MachineBrandSchema = mongoose.Schema({

  name                : String, //品牌名称
  model               : String,
  type                : String, //透析方式 HD / HDF
  ready_time          : String,
  disinfect_time      : String,

  hospital            : {type: ObjectId, ref: 'Hospital'},
  deleted             : {type: Boolean, default: false},
  update_time   : {type: Number, default: getTime },
  create_time         : {type: Date, default: Date.now}
});

module.exports = mongoose.model('MachineBrand', MachineBrandSchema);