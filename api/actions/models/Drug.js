/**
 * Created by isaac on 11/4/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../lib/util';

//药品
var DrugSchema = mongoose.Schema({

    name         : {type: String, required: true}, //Chinese Name
    raw_id       : Number,
    //原始信息 含制药厂信息
    origin_info  : String,
    common_name  : {type: String}, //Common Name
    en_name      : {type: String}, //English Name
    vs_name      : {type: String}, //Medical Name
    show_name    : {type: String}, //Display Name
    other_name   : {type: String}, //Other Name, seperate by `|`
    short_names  : [{type: String}],
    pinyin_name  : {type: String},

    FDA          : {type: String},
    company_id   : {type: Number},
    company      : {type: ObjectId, ref: 'Company'}, //Drug company
    OTC          : {type: Boolean, default: false},

    component    : {type: String},
    indication   : {type: String},
    dosage       : {type: String},
    contraindications: {type: String},
    precautions  : {type: String},
    adverse_reactions: {type: String},
    drug_interactions: {type: String},
    forensic_classification: {type: String},
    type         : {type: ObjectId, ref: 'DrugType'},
    pack         : {type: String},
    grade        : {type: Number},
    // category     : {type: ObjectId, ref: 'DrugCategory'},
    price        : String, // 价格
    unit_amount  : String, // 单次用量
    unit         : String, // 单位
    warning      : {type: String},

    inner_component : [{
        id: {type: String},
        name: {type: String},
        FDA: {type: String},
        LRC: {type: String},
    }],

    deleted      : {type: Boolean, default: false},
    create_time  : {type: Date, default: Date.now},
    update_time   : {type: Number, default: getTime },
});

module.exports = mongoose.model('Drug', DrugSchema);
