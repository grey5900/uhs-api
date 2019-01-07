/**
 * Created by isaac on 16/6/16.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
import {getTime} from '../lib/util';

var CureDiarySchema = mongoose.Schema({

  patient     : {type: ObjectId, ref: 'Patient'},
  doctor      : {type: ObjectId, ref: 'Doctor'},
  events      : [{
    target_id   : {type: ObjectId},
    model       : String, // model of `target_id` in mongoose
    content     : String,
  }],
  comment     : String,
  update_time   : {type: Number, default: getTime },
  create_time   : {type: Number, default: getTime }
});

module.exports = mongoose.model('CureDiary', CureDiarySchema);
CureDiarySchema.plugin(deepPopulate);