/**
 * Created by Zhengjiawei on 8/10/16.
 * version 2.2  add muti logic map, add multi pages
 */
import mongoose from 'mongoose';
import config from '../../config';
import {patientProcessors, normalProcessors} from './func';

const {ObjectId} = mongoose.Types;
const Patient = mongoose.model('Patient');
const PhysicalExam = mongoose.model('PhysicalExam');
const Doctor = mongoose.model('Doctor');
const DialysisSupply = mongoose.model('DialysisSupply');
const KidneyDiagnosis = mongoose.model('KidneyDiagnosis');
const Medicare = mongoose.model('Medicare');
const NutritionAssessment = mongoose.model('NutritionAssessment');
const Order = mongoose.model('Order');
const PathologicDiagnosis = mongoose.model('PathologicDiagnosis');
const Prescription = mongoose.model('Prescription');
const FollowupRecord = mongoose.model('FollowupRecord');
const DialysisItem = mongoose.model('DialysisItem');
const Outcome = mongoose.model('Outcome');


const modelMap = {
  'Patient': Patient,
  'FollowupRecord': FollowupRecord,
  'Doctor': Doctor,
  'DialysisSupply': DialysisSupply,
  'KidneyDiagnosis': KidneyDiagnosis,
  'Medicare': Medicare,
  'NutritionAssessment': NutritionAssessment,
  'Order': Order,
  'PathologicDiagnosis': PathologicDiagnosis,
  'Prescription': Prescription,
  'PhysicalExam': PhysicalExam,
  'DialysisItem': DialysisItem,
  'Outcome': Outcome
};

export default function (req) {
  return new Promise((resolve, reject) => {
    const {conditions, skip = 0, limit = 12} = req.body;
    if (conditions && conditions.length > 0) {
      const logicPatientId = [];
      // All the searches will go at same time, return an array of Promise object for latter use
      const innerPromises = conditions.map((condition, index) => {
        return new Promise((resolve, reject) => {
          const {model, operator} = condition;
          if (modelMap[model] === undefined) {
            reject({msg: 'currently don\'t support searching for this model: ' + model})
          } else {
            const func = model === 'Patient' ? patientProcessors[operator] : normalProcessors[operator];
            if (func) {
              func(condition, logicPatientId, index, resolve, reject);
            } else {
              reject({msg: 'wrong operator!'});
            }
          }
        });
      });
      // after every innerPromises resolved, get the list of patient id list[,[]], do logic map and return results
      Promise.all(innerPromises).then(
        () => {
          const idList = multiLogicMap(logicPatientId);
          Patient.aggregate([
            {$match: {_id: {$in: idList}}}
          ]).exec((err, allResults)=> {
            if (err) {
              reject({msg: '搜索失败!'});
            } else {
              if (allResults.length === 0) {
                resolve({
                  code: config.code.success,
                  data: {
                    total: 0,
                    model: 'Patient',
                    results: []
                  }
                });
              } else {
                Patient.aggregate([
                  {$match: {_id: {$in: idList}}},
                  {$skip: skip},
                  {$limit: limit},
                  {$sort: {create_time: -1}}
                ]).exec((err, results)=> {
                  if (err || !results) {
                    console.log(err);
                    reject({msg: '查找失败！'});
                  } else {
                    resolve({
                      code: config.code.success,
                      data: {
                        total: allResults.length,
                        model: 'Patient',
                        results
                      }
                    });
                  }
                });
              }
            }
          });
        },
        reject
      );
    } else {
      reject({msg: '缺少conditions参数!'});
    }
  });
};


function logicAND(a, b) {
  let result = [];
  let r = a.map((item)=> {
    return (b.indexOf(item) > -1 ? item : null);
  });
  r.forEach((item)=> {
    if (item)
      result.push(item);
  });
  return {id: result};
}

function logicOR(a, b) {
  b.forEach((item) => a.push(item));
  let s = new Set(a);
  let result = [];
  s.forEach((item) => {
    result.push(item);
  });
  return {id: result};
}

function multiLogicMap(listObj) {
  const result = listObj.reduce((i, j) => {
    if (j.logic === 'AND') {
      return logicAND(i.id, j.id);
    } else if (j.logic === 'OR') {
      return logicOR(i.id, j.id);
    } else {
      console.log('Currently we only support logic AND logic OR!');
    }
  });
  return result.id.map(ObjectId);
}
