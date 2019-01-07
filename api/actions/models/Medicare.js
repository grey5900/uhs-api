 /**
 * Created by isaac on 11/4/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var mongoosastic = require('mongoosastic');
import {getTime} from '../lib/util';

//医保
var MedicareSchema = mongoose.Schema({

    number      : {type: String}, // 医保编号
    locality    : {type: String, es_indexed: true},                                      // 医保所属地
    type        : {type: String, es_indexed: true},                                      // 医保类型
    patient     : {type: ObjectId, ref: 'Patient', es_indexed: true},
    deleted     : {type: Boolean, default: false},
    create_time : {type: Date, default: Date.now},
    update_time   : {type: Number, default: getTime },
});

 MedicareSchema.plugin(mongoosastic);
module.exports = mongoose.model('Medicare', MedicareSchema);
