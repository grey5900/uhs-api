/*
 * Copyright(c) omk 2016
 * Filename: search.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期三,  3 八月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
const Patient = mongoose.model('Patient');

export default function search(req) {
  function getArgs(items) {
    return items.map((item) => {
      const result = {};
      const {field, value} = item;

      switch (item.operator) {
        case 'eq':
          result[field] = value;
          break;
        case 'neq':
          result[field] = {$ne: value};
          break;
        case 'has':
          result[field] = new RegExp(value, 'i');
          break;
        case 'in':
          const valueArr = value.split(',');
          const valueStrArr = valueArr.map((obj) => `"${obj}"`);
          console.log('valueArr', valueArr, valueStrArr);
          result[field] = {$in: valueArr};
          break;
        case 'gt':
          result[field] = {$gt: value};
          break;
        case 'gte':
          result[field] = {$gte: value};
          break;
        case 'lt':
          result[field] = {$lt: value};
          break;
        case 'lte':
          result[field] = {$lte: value};
          break;
      }
      return result;
    });
  }
  return new Promise((resolve, reject) => {
    const {conditions} = req.body;
    console.log('11111', conditions, req.body);
    if (conditions) {
      const group = {};
      if (conditions.length > 0) {
        for (let i = 0; i < conditions.length; i++) {
          const condition = conditions[i];
          if (!group[condition.model]) {
            group[condition.model] = [];
          }
          group[condition.model].push(condition);
        }
        const keys = Object.keys(group);
        if (keys.length === 1) {
          const obj = keys[0];
          const args = getArgs(group[obj]);
          console.log('args', args);
          mongoose.model(obj).find({$and: args}, (err, docs) => {
            if (err) {
              reject({msg: '查找失败'});
            } else {
              if (docs[0].patient) {
                const docPatientsUnique = [];
                const docsUnique = [];
                docs.forEach((doc) => {
                  if (!docPatientsUnique.includes(doc.patient.toString())) {
                    docPatientsUnique.push(doc.patient.toString());
                    docsUnique.push(doc);
                  }
                });
                Patient.populate(docsUnique, {path: 'patient'}, (patientErr, popdocs) => {
                  if (patientErr) {
                    reject({msg: '查找失败'});
                  } else {
                    const patients = popdocs.map((doc) => doc.patient);
                    resolve({
                      code: 1000,
                      data: {
                        total: patients.length,
                        model: 'Patient',
                        results: patients
                      }
                    });
                  }
                });
              } else {
                resolve({
                  code: 1000,
                  data: {
                    total: docs.length,
                    model: obj,
                    results: docs
                  }
                });
              }
            }
          });
        } else if (keys.indexOf('Patient') !== -1) {
          keys.splice(keys.indexOf('Patient'), 1);
          let patientList = [];
          const promises = keys.map((key, index) => {
            return new Promise((resolve, reject) => {
              const args = getArgs(group[key]);
              mongoose.model(key).find({$and: args}, (err, docs) => {
                if (err) {
                  reject({msg: '查找失败'}
                  );
                } else {
                  const docPatientsUnique = [];
                  docs.forEach((doc) => {
                    if (!docPatientsUnique.includes(doc.patient.toString())) {
                      docPatientsUnique.push(doc.patient.toString());
                    }
                  });
                  if (index === 0) {
                    patientList = docPatientsUnique;
                  } else {
                    const union = [];
                    docPatientsUnique.forEach((item) => {
                      if (patientList.includes(item)) {
                        union.push(item);
                      }
                    });
                    patientList = union;
                  }
                  resolve();
                }
              });
            });
          });
          const patientArgs = getArgs(group.Patient);
          Promise.all(promises).then(() => {
            patientArgs.push({_id: {$in: patientList}});
            Patient.find({$and: patientArgs}, (err, docs) => {
              if (err) {
                reject({msg: 'patient 查找失败'});
              } else {
                resolve({
                  code: 1000,
                  data: {
                    total: docs.length,
                    model: 'Patient',
                    results: docs
                  }
                });
              }
            });
          });
        } else {
          reject({msg: '搜索条件过于复杂'});
        }
      } else {
        resolve({
          code: config.code.success,
          data: {
            total: 0,
            model: 'Patient',
            results: []
          }
        });
      }
    } else {
      reject({msg: '搜索失败'});
    }
  });
}
