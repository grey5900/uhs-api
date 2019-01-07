/**
 * Created by isaac on 11/4/15.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../lib/util';

//医院
var HospitalSchema = mongoose.Schema({

    name           : String,

    province       : String,
    city           : String,
    area           : String,
    address        : String,

    super_hospital : {type: ObjectId, ref: 'Hospital'},
    create_time    : {type: Date, default: Date.now},
    update_time   : {type: Number, default: getTime },
});

module.exports = mongoose.model('Hospital', HospitalSchema);
