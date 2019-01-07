/**
 * Created by isaac on 16/4/13.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../lib/util';

//化验单类别
var SheetTypeSchema = mongoose.Schema({

  name         : String, //参考项目名称
  price        : String, //项目价格
  references   : [{type: ObjectId, ref: 'SheetReference'}],

  deleted      : {type: Boolean, default: false},
  create_time  : {type: Date, default: Date.now},
  update_time   : {type: Number, default: getTime },
});

module.exports = mongoose.model('SheetType', SheetTypeSchema);
