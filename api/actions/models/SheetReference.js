/**
 * Created by isaac on 11/4/15.
e*/
var mongoose = require('mongoose');
import {getTime} from '../lib/util';

//化验数据参考
var SheetReferenceSchema = mongoose.Schema({

    name         : String, //参考项目名称
    short_name   : String,
    max_value    : String,
    min_value    : String,
    reference    : String,
    unit         : String,

    deleted         : {type: Boolean, default: false},
    create_time  : {type: Date, default: Date.now},
    update_time   : {type: Number, default: getTime },
});

module.exports = mongoose.model('SheetReference', SheetReferenceSchema);
