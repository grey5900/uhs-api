var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../lib/util';

//过敏诊断
var AllergyDiagnosisSchema = mongoose.Schema({

  patient            : {type: ObjectId, ref: 'Patient'},
  diagnosis_time     : {type: Date, default: Date.now},
  //过敏诊断
  classify           : [String],
  classify_other     : [String],
  //透析器材过敏
  devices            : [String],
  //透析膜
  film               : [String],
  film_info          : String,
  //透析器型号
  devices_model      : String,
  //消毒剂
  disinfectant       : [String],
  disinfectant_info  : String,
  //药物过敏
  drug               : [String],
  //抗生素
  antibiotic_name    : String,
  //静脉铁剂
  venofer_name       : String,
  dextrose_name      : String,
  //肝素
  heparin            : [String],
  drug_other         : String,

  doctor_name        : String,

  creator        : {type: ObjectId, ref: 'Admin'},
  create_time    : {type: Date, default: Date.now},
  update_time   : {type: Number, default: getTime },
  deleted        : {type: Boolean, default: false}
});

module.exports = mongoose.model('AllergyDiagnosis', AllergyDiagnosisSchema);