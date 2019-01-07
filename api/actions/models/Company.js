/**
 * Created by isaac on 1/22/16.
 */
var mongoose = require('mongoose');
import {getTime} from '../lib/util';

//Drug Company
var CompanySchema = mongoose.Schema({

  name       : String,
  raw_id       :Number,
  en_name       : String,
  description   : String,
  short_name    : String,
  phone         : String,

  deleted       : {type: Boolean, default: false},
  update_time   : {type: Number, default: getTime },
  create_time   : {type: Date, default: Date.now}
});

module.exports = mongoose.model('Company', CompanySchema);
