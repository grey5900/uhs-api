/**
 * Created by isaac on 16/4/16.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../lib/util';

// 配置
var MetaSchema = mongoose.Schema({

  name       : {type: String, required: true},
  value      : {type: String},
  list       : [{name: String, value: String}],
  hidden     : {type: Boolean, default: false},
  create_time: {type: Date, default: Date.now},
  update_time   : {type: Number, default: getTime },
});

module.exports = mongoose.model('Meta', MetaSchema);