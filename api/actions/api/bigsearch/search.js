/**
 * Created by isaac on 16/8/18.
 */

import mongoose from 'mongoose';
import config from '../../config';
const PatientModel = mongoose.model('Patient');

const processors = {};

processors['in'] = (condition, query) => {
  const {field, value, join} = condition;
  const valueArray = value.split(',');
  const args = {};
  args[field] = {$in: valueArray};
  query[join].push(args);
};

processors['range'] = (condition, query) => {
  const {field, value, join} = condition;
  const args = {};
  args[field] = {$gte: parseFloat(value[0]), $lte: parseFloat(value[1])};
  query[join].push(args);
};

processors['eq'] = (condition, query) => {
  const {field, value, join} = condition;
  const args = {};
  args[field] = value;
  query[join].push(args);
};

processors['has'] = (condition, query) => {
  const {field, value, join} = condition;
  const args = {};
  args[field] = new RegExp(value, 'i');
  query[join].push(args);
};

function gatherConditions(conditions) {
  const query = {AND: [], OR: []};
  if (Array.isArray(conditions) && conditions.length > 0) {
    conditions.forEach((current) => {
      const {operator} = current;
      const func = processors[operator];
      if (func) {
        func(current, query);
      } else {
        console.log('[warning] unknown operator', operator);
      }
    });
  }
  const {AND, OR} = query;
  const result = {};
  if (OR.length > 0) {
    result.$or = OR;
    if (AND.length > 0) {
      result.$or.push({$and: AND});
    }
  } else if (AND.length > 0) {
    result.$and = AND;
  }
  return result;
}

function bulkSearch(conditionMap, patientIDs, resolve, reject) {
  const keys = Object.keys(conditionMap);
  const results = {};
  if (keys.length > 0) {
    const promises = keys.map(key => new Promise((innerResolve, innerReject) => {
      const conditions = conditionMap[key];
      const Model = mongoose.model(key);
      const query = gatherConditions(conditions);
      query.patient = {$in: patientIDs};
      Model.find(query).exec((error, docs) => {
        if (error) {
          console.log(error);
          innerReject(error);
        } else if (docs && docs.length > 0) {
          results[key] = docs;
          innerResolve();
        } else {
          innerResolve();
        }
      });
    }));
    Promise.all(promises).then(() => {
      resolve(results);
    }, reject);
  } else {
    resolve(results);
  }
}

export default function (req) {
  return new Promise((resolve, reject) => {
    const {conditions, skip = 0, limit = 12} = req.body;
    if (conditions && Object.keys(conditions).length > 0) {
      const {Patient, ...otherConditions} = conditions;
      const query = gatherConditions(Patient);
      PatientModel.count(query)
        .exec((error, count) => {
          if (error) {
            console.log(error);
            reject({msg: '查询失败!'});
          } else if (count > 0) {
            PatientModel.find(query)
              .skip(skip).limit(limit)
              .sort({create_time: -1})
              .exec((error, docs) => {
                if (error) {
                  console.log(error);
                  reject({msg: error.message});
                } else {
                  const patientIDs = docs.map(doc => doc._id);
                  bulkSearch(otherConditions, patientIDs, (results) => {
                    results.Patient = docs;
                    resolve({
                      code: config.code.success,
                      data: results,
                      total: count
                    });
                  }, reject);
                }
              });
          } else {
            resolve({
              code: config.code.success,
              data: {},
              total: count
            });
          }
        });
    } else {
      reject({msg: '缺少conditions参数!'});
    }
  });
};
