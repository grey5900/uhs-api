/**
 * Created by chris on 12/3/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../lib/util';

var CreditSchema = mongoose.Schema({

  patient    : {type: ObjectId, ref: 'Patient'},
    // 积分值
  credits    : String,
  update_time   : {type: Number, default: getTime },
  create_time : {type: Date, default: Date.now}
});

module.exports = mongoose.model('Credit', CreditSchema);