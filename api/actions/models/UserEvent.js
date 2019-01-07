/**
 * Created by isaac on 1/8/16.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../lib/util';

var UserEventSchema = mongoose.Schema({

  patient     : {type: ObjectId, ref: 'Patient'},
  doctor      : {type: ObjectId, ref: 'Doctor'},
  target_id   : {type: ObjectId},
  type        : {type: String},
  comment     : {type: String},
  start_time  : {type: Date},
  end_time    : {type: Date},
  name        : String,

  creator     : {type: ObjectId, ref: 'Admin'},
  create_time : {type: Date, default: Date.now},
  update_time   : {type: Number, default: getTime },
  deleted     : {type: Boolean, default: false}
});

module.exports = mongoose.model('UserEvent', UserEventSchema);
