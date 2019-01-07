/**
 * Created by isaac on 1/22/16.
 */
var mongoose = require('mongoose');
import {getTime} from '../lib/util';

//Drug Price
var PriceSchema = mongoose.Schema({

    name       : String,
    standard      : String,
    code          : String,
    price         : Number,
    shop          : String,
    phone         : String,
    type          : Number,

    deleted       : {type: Boolean, default: false},
    create_time   : {type: Date, default: Date.now},
    update_time   : {type: Number, default: getTime },
});

module.exports = mongoose.model('Price', PriceSchema);
