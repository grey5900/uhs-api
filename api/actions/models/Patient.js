/**
 * Created by chris on 15-11-4.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var mongoosastic = require('mongoosastic');
import {getTime} from '../lib/util';

var PatientSchema = mongoose.Schema({

    real_name       : {type: String, es_indexed: true}, //patient's real name.
    pinyin          : String,
    user_name       : {type: String, es_indexed: true},
    person_id       : {type: String, es_indexed: true }, //ID card
    //start yinhai his fields
    jzh             : {type: String, es_indexed: true}, //就诊号
    yh_his          : {
      jzid          : String, //就诊ID
      brid          : String, //病人ID, 治疗周期内唯一
      yyid          : String, //医院ID
    },
    //end of yinhai his fields
    cnrds_id        : String, // patient id in hd.cnrds.net

    password        : String,
    type            : {type: String, enum: ['ckd', 'hemodialysis', 'peritoneal'], default: 'ckd', es_indexed: true, es_index: 'not_analyzed'},
    peritoneal_id   : String,
    doctor          : {type: ObjectId, ref: 'Doctor'},
    nurse           : {type: ObjectId, ref: 'Doctor'},
    avatar          : {type: ObjectId, ref: 'File'},
    // fingerprint info
    finger_str       : String,
    finger_id         : {type: Number, unique: true, sparse: true},

    //contact
    mobile          : {type: String, es_indexed: true},
    email           : {type: String, es_indexed: true},
    qq              : {type: String, es_indexed: true},
    contact         : [{type: ObjectId, ref: 'Contact'}],

    //address part
    area            : {type: String, es_indexed: true},
    city            : {type: String, es_indexed: true},
    address_detail  : {type: String, es_indexed: true},
    zipcode         : {type: String, es_indexed: true},

    //personal info
    gender          : {type: String, enum: ['Male', 'Female', ''], default: 'Male', es_indexed: true, es_index: 'not_analyzed'},
    birthday        : Date,
    job             : {type: String, es_indexed: true},
    nation          : {type: String, es_indexed: true},
    education_degree: {type: String, enum: ['', 'primary', 'junior', 'senior', 'college', 'bachelor', 'master', 'doctor'], default: '', es_indexed: true, es_index: 'not_analyzed'},
    marital_status  : {type: String, enum: ['single', 'married', 'divorce', ''], default: '', es_indexed: true, es_index: 'not_analyzed'},
    company         : {type: String, es_indexed: true},

    //medical info
    inhospital_number : {type: String, es_indexed: true}, //住院号
    outpatient_number : {type: String, es_indexed: true}, //门诊号
    treatment_number : {type: String, es_indexed: true}, //透析病案号

    // medicare: 医保
    medicare        : {type: ObjectId, ref: 'Medicare'},
    //hospital
    hospital        : {type: ObjectId, ref: 'Hospital'},
    record          : {type: ObjectId, ref: 'Record'},
    //治疗方案
    treat_plans     : [{type: ObjectId, ref: 'TreatPlan'}],

    dialysis_machine : {type: ObjectId, ref: 'DialysisMachine'},
    dialysis_supplies: {type: ObjectId, ref: 'DialysisSupply'},

    //payment
    alipay          : {type: String, es_indexed: true},
    wechat          : {type: String, es_indexed: true},
    card           : {type: ObjectId, ref: 'CardInfo'},

    dialysis_schedule_days : {type: String, default: '1-3-5'},

    is_reviewer : {type: Boolean, default: false},
    //event
    current_event   : {type: ObjectId, ref: 'UserEvent'},

    creator         : {type: ObjectId, ref: 'Admin'},
    deleted         : {type: Boolean, default: false},
    create_time : {type: Date, default: Date.now},
    update_time   : {type: Number, default: getTime },

    //转归
    outcome         : {type: ObjectId, ref: 'Outcome'}
});

PatientSchema.plugin(deepPopulate,{
    populate: {
        'record.sheet': {
            match: {deleted: false}
        },
        'record.sheet.results': {
            match: {deleted: false}
        }
    }
});

PatientSchema.plugin(mongoosastic);
module.exports = mongoose.model('Patient', PatientSchema);
