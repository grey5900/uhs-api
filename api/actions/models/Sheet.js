var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
import {getTime} from '../lib/util';

//化验单
var SheetSchema = mongoose.Schema({

  record      : {type: ObjectId, ref: 'Record'},
  patient     : {type: ObjectId, ref: 'Patient'},
  doctor      : {type: ObjectId, ref: 'Doctor'},
  hospital    : {type: ObjectId, ref: 'Hospital'},
  type        : {type: ObjectId, ref: 'SheetType'},
  report_time : Date,
  diagnosis   : {type: ObjectId, ref: 'Diagnosis'},

  results     : [{type: ObjectId, ref: 'SheetResult'}],

  deleted     : {type: Boolean, default: false},
  create_time : {type: Date, default: Date.now},
  update_time   : {type: Number, default: getTime },
});

SheetSchema.plugin(deepPopulate,{
  populate: {
    'results': {
      match: {deleted: false}
    }
  }
});

module.exports = mongoose.model('Sheet', SheetSchema);
