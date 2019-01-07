/**
 * Created by isaac on 2016/3/21.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../lib/util';

//相关疾病
var DiseaseRecordSchema = mongoose.Schema({
  patient         : {type: ObjectId, ref: 'Patient'},
  name            : {type: String, required: true},
  start_time      : {type: Date},
  end_time        : {type: Date},
  tags            : [String], //tags
  symptom         : [{
    name: String,
    value: String
  }], //
  description     : String, //具体说明
  diagnosis       : {type: ObjectId, ref: 'Diagnosis'}, //诊断

  deleted      : {type: Boolean, default: false},
  update_time   : {type: Number, default: getTime },
  create_time  : {type: Date, default: Date.now}
});

module.exports = mongoose.model('DiseaseRecord', DiseaseRecordSchema);
