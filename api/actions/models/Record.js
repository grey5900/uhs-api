/**
 * Created by isaac on 11/4/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../lib/util';

//病历
var RecordSchema = mongoose.Schema({

    patient       : {type: ObjectId, ref: 'Patient'},
    doctor        : {type: ObjectId, ref: 'Doctor'},
    hospital      : {type: ObjectId, ref: 'Hospital'},

    fistula_file1 : {type: ObjectId, ref: 'File'},
    fistula_file2 : {type: ObjectId, ref: 'File'},
    fistula_file3 : {type: ObjectId, ref: 'File'},
    idea_mass     : {type: Number},
    first_treat_time : String, // 首次透析时间

    //医嘱
    order         : [{type: ObjectId, ref: 'Order'}],
    //处方
    prescription  : [{type: ObjectId, ref: 'Prescription'}],
    //化验单
    sheet         : [{type: ObjectId, ref: 'Sheet'}],

    //并发症
    complication  : [{type: ObjectId, ref: 'Disease'}],
    //原发
    idiopathy     : [{type: ObjectId, ref: 'Disease'}],
    //转归
    state       : String,

    deleted       : {type: Boolean, default: false},
    create_time   : {type: Date, default: Date.now},
    update_time   : {type: Number, default: getTime },
});

module.exports = mongoose.model('Record', RecordSchema);
