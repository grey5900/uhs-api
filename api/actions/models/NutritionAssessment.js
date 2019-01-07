/**
 * Created by isaac on 2016/3/19.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
import {getTime} from '../lib/util';

//营养评估
var NutritionAssessmentSchema = mongoose.Schema({

  patient        : {type: ObjectId, ref: 'Patient'},
  assessment_time: {type: Date, default: Date.now},
  average_weight : Number, //6个月平均体重
  descent_rate   : Number, //2周来下降率
  weight_level   : {type: String, enum: ['bad', 'mild', 'normal']},
  diet_restrict  : {type: Boolean, default: false}, //饮食限制
  diet_restrict_duration : {type: String}, //持续时间
  solid          : {type: String},//接近固体
  liquid         : {type: String},//足量流体
  low_calorie_liquid: {type: String},//低热量流体
  fast           : {type: String}, //绝食

  diet_level     : {type: String, enum: ['bad', 'mild', 'normal']},
  subcutaneous_fat: {type: String, enum: ['bad', 'mild', 'normal']},
  muscle_breakdown: {type: String, enum: ['bad', 'mild', 'normal']},

  creator        : {type: ObjectId, ref: 'Admin'},
  create_time    : {type: Date, default: Date.now},
  update_time   : {type: Number, default: getTime },
  deleted     : {type: Boolean, default: false}
});

module.exports = mongoose.model('NutritionAssessment', NutritionAssessmentSchema);
