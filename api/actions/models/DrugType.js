/**
 * Created by isaac on 16/3/4.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../lib/util';

// 药品类型
var DrugTypeSchema = mongoose.Schema({

  name        : String,
  super_type  : {type: ObjectId, ref: 'DrugType', default: null},
  creator     : {type: ObjectId, ref: 'Admin'},
  deleted     : {type: Boolean, default: false},
  create_time : {type: Date, default: Date.now},
  update_time   : {type: Number, default: getTime },
});

module.exports = mongoose.model('DrugType', DrugTypeSchema);
