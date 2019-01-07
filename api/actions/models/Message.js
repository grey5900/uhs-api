/**
 * Created by isaac on 2016/4/4.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../lib/util';

// 消息
var MessageSchema = mongoose.Schema({

  title      : {type: String, required: true},
  content    : {type: String},
  url        : {type: String},

  level        : {type: Number, enum: [0, 1, 2, 3, 4, 5], default: 0},

  origin       : {type: ObjectId},
  context      : String,
  patient      : {type: ObjectId, ref: 'Patient'},
  doctor       : {type: ObjectId, ref: 'Doctor'},
  receiver     : {type: ObjectId, ref: 'Admin'},

  has_read   : {type: Boolean, default: false},
  creator    : {type: ObjectId, ref: 'Admin'},
  create_time: {type: Date, default: Date.now},
  update_time   : {type: Number, default: getTime },
});

module.exports = mongoose.model('Message', MessageSchema);