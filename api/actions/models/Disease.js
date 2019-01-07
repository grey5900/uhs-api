/**
 * Created by isaac on 11/4/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../lib/util';

//疾病
var DiseaseSchema = mongoose.Schema({

    name            : {type: String, required: true},
    en_name         : {type: String},
    defination      : {type: String},
    treatment       : {type: String},
    treatment_brief : {type: String},
    start_time      : {type: Date},
    end_time        : {type: Date},
    symptom         : [String],
    description     : String,
    diagnosis       : {type: ObjectId, ref: 'Diagnosis'},

    type         : {type: ObjectId, ref: 'DiseaseType'},
    deleted      : {type: Boolean, default: false},
  update_time   : {type: Number, default: getTime },
    create_time  : {type: Date, default: Date.now}
});

module.exports = mongoose.model('Disease', DiseaseSchema);
