var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../lib/util';

//病理诊断
var PathologicDiagnosisSchema = mongoose.Schema({

  patient        : {type: ObjectId, ref: 'Patient'},
  date           : {type: Date, default: Date.now},
  //分类
  classify       : String,
  //原发
  primary        : [String],
  primary_other  : [String],
  //继发
  secondary      : [String],
  secondary_other: [String],
  //遗传性
  genetic        : [String],
  genetic_other  : [String],
  //肾小管
  tubule         : [String],
  tubule_other   : [String],

  creator        : {type: ObjectId, ref: 'Admin'},
  create_time    : {type: Date, default: Date.now},
  update_time   : {type: Number, default: getTime },
  deleted        : {type: Boolean, default: false}
});

module.exports = mongoose.model('PathologicDiagnosis', PathologicDiagnosisSchema);
