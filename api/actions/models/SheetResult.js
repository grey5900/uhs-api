/**
 * Created by isaac on 11/4/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../lib/util';

//化验数据结果
var SheetResultSchema = mongoose.Schema({

  name         : String,
  short_name   : String,
  value        : String,
  reference    : {type: ObjectId, ref: 'SheetReference'},
  //该项结果是否异常, false为在合理范围内，true为结果异常
  abnormal     : {type: Boolean, default: false},

  deleted      : {type: Boolean, default: false},
  create_time  : {type: Date, default: Date.now},
  update_time   : {type: Number, default: getTime },
});

module.exports = mongoose.model('SheetResult', SheetResultSchema);
