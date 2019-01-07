/**
 * Created by chris on 15-11-4.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../lib/util';

var ContactSchema = mongoose.Schema({

  name       : String, //patient's real name.

  //contact
  phone           : String,
  mobile          : String,
  email           : String,
  qq              : String,
  relationship    : {type: String, enum: ['', 'parent', 'spouse', 'child'], default: ''},

  //address part
  area            : String,
  address_detail  : String,
  zipcode         : String,

  creator         : {type: ObjectId, ref: 'Admin'},
  deleted         : {type: Boolean, default: false},
  update_time   : {type: Number, default: getTime },
  create_time : {type: Date, default: Date.now}
});

module.exports = mongoose.model('Contact', ContactSchema);

