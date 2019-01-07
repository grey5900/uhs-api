/**
 * Created by isaac on 11/4/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var mongoosastic = require('mongoosastic');
import {getTime} from '../lib/util';

//处方
var PrescriptionSchema = mongoose.Schema({

  prescription_id   : String,
  record            : {type: ObjectId, ref: 'Record'},
  followup          : {type: ObjectId, ref: 'FollowupRecord'},
  prescription_drug : [{
    drug            : {type: ObjectId, ref: 'TreatPlan'},
    usage           : String,  //用法 '口服，注射'等
    dosage          : String,  //每次剂量
    frequency       : String, //每日频率如 '每日三次'等
    amount          : String,  //处方开药的总量
    comment         : String,  //备注信息
  }],
  date              : {type: Date, default: Date.now},
  doctor            : {type: ObjectId, ref: 'Doctor', es_indexed: true},

  deleted           : {type: Boolean, default: false},
  create_time       : {type: Date, default: Date.now},
  update_time   : {type: Number, default: getTime },
});

PrescriptionSchema.plugin(deepPopulate);
PrescriptionSchema.plugin(mongoosastic);
module.exports = mongoose.model('Prescription', PrescriptionSchema);
