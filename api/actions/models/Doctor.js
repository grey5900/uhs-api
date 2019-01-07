/**
 * Created by isaac on 11/4/15.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var mongoosastic = require('mongoosastic');
import {getTime} from '../lib/util';

//医生
var DoctorSchema = mongoose.Schema({

    //id
    qualification: {type: String}, //医师资格证
    person_id    : String, //身份证号码
    name         : {type: String, es_indexed: true},
    title        : String, //职称

    hospital     : {type: ObjectId, ref: 'Hospital'},
    department   : {type: String, es_indexed: true},                        // 科室
    is_charger   : {type: Boolean, default: false}, // 是否为主治医生
    role         : {type: String, enum: ['doctor', 'nurse', 'charger']},

    //messages
    messages     : [{type: ObjectId, ref: 'Message'}],
    //contact
    mobile       : {type: String, es_indexed: true},
    email        : {type: String, es_indexed: true},
    wechat       : String,
    qq           : String,
    contact         : [{type: ObjectId, ref: 'Contact'}],

    //personal
    gender       : {type: String, enum: ['Male', 'Female'], default: 'Male'},  //0: male, 1: female
    avatar       : {type: ObjectId, ref: 'File'},
    birthday     : Date,
    comment      : String,

    create_time  : {type: Date, default: Date.now},
    deleted     : {type: Boolean, default: false},
    update_time   : {type: Number, default: getTime },
    // yinhai his
    yh_doctor_id: String,
});

DoctorSchema.plugin(mongoosastic);
module.exports = mongoose.model('Doctor', DoctorSchema);
