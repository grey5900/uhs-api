/**
 * Created by Grey on 16/9/4.
 */
var mongoose = require('mongoose');
import {getTime} from '../../lib/util';

var RoleSchema = mongoose.Schema({

  name          : String,
  role          : String,
  permissions   : [{
    model       : String, // mongoose model
    name        : String, // name to display
    allow       : [String]
  }],

  deleted       : {type: Boolean, default: false},
  update_time   : {type: Number, default: getTime},
  create_time   : {type: Number, default: getTime}
});

module.exports = mongoose.model('Role', RoleSchema);
