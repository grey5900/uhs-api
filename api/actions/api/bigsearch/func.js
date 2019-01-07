/**
 * Created by isaac on 16/8/17.
 */
import mongoose from 'mongoose';

export const patientProcessors = {};

patientProcessors['eq'] = (condition, logicPatientId, index, resolve, reject) => {
  const {join, model, field, value} = condition;
  const match = {};
  match[field] = value;
  mongoose.model(model).aggregate([
    {$match: match},
    {$project: {_id: 1}}
  ]).exec((err, results) => {
    if (err) {
      reject({msg: '搜索失败!'});
    } else {
      const resultsString = results.map((obj) => obj._id.toString());
      logicPatientId[index] = {logic: join, id: resultsString};
      resolve();
    }
  });
};

patientProcessors['in'] = (condition, logicPatientId, index, resolve, reject) => {
  const {join, model, field, value} = condition;
  const match = {};
  const valueArray = value.split(',');
  match[field] = {$in: valueArray};
  mongoose.model(model).aggregate([
    {$match: match},
    {$project: {_id: 1}}
  ]).exec((err, results) => {
    if (err) {
      reject({msg: '搜索失败!'});
    } else {
      const resultsString = results.map((obj) => obj._id.toString());
      logicPatientId[index] = {'logic': join, 'id': resultsString};
      resolve();
    }
  });
};

patientProcessors['has'] = (condition, logicPatientId, index, resolve, reject) => {
  const {join, model, field, value} = condition;
  const queryv = {};
  queryv[field] = {query: value, fuzziness: 'AUTO'};
  mongoose.model(model).search({
    query: {
      bool: {
        must: {
          match: queryv
        }
      }
    }
  }, (err, results) => {
    if (err) {
      reject({msg: 'es search failed!'});
    } else if (results) {
      const resultsString = results.hits.hits.map((obj) => obj._id);
      logicPatientId[index] = {logic: join, id: resultsString};
      resolve();
    } else {
      logicPatientId[index] = {};
      resolve();
    }
  });
};

// register for other model
export const normalProcessors = {};

normalProcessors['eq'] = (condition, logicPatientId, index, resolve, reject) => {
  const {join, model, field, value} = condition;
  const matchValue = {};
  matchValue[field] = value;
  mongoose.model(model).aggregate([
    {$match: matchValue},
    {$project: {patient: 1, _id: 0}}
  ]).exec((err, results) => {
    if (err) {
      reject({msg: '搜索失败!'});
    } else {
      const resultsString = results.map((obj) => {
        if (obj.patient) {
          return obj.patient.toString();
        }
      });
      logicPatientId[index] = {logic: join, id: resultsString};
      resolve();
    }
  });
};

normalProcessors['in'] = (condition, logicPatientId, index, resolve, reject) => {
  const {join, model, field, value} = condition;
  const matchValue = {};
  let valueArray = value.split(',');
  matchValue[field] = {$in: valueArray};
  mongoose.model(model).aggregate([
    {$match: matchValue},
    {$project: {patient: 1, _id: 0}}
  ]).exec((err, results) => {
    if (err) {
      reject({msg: '搜索失败!'});
    } else {
      const resultsString = results.map((obj) => {
        if (obj.patient) {
          return obj.patient.toString();
        }
      });
      logicPatientId[index] = {logic: join, id: resultsString};
      resolve();
    }
  });
};

normalProcessors['has'] = (condition, logicPatientId, index, resolve, reject) => {
  const {join, model, field, value} = condition;
  const queryv = {};
  queryv[field] = {query: value, fuzziness: 'AUTO'};
  mongoose.model(model).search({
    query: {
      bool: {
        must: {
          match: queryv
        }
      }
    }
  }, (err, results) => {
    if (err) {
      console.log(err);
      reject({msg: 'es search failed!'});
    } else if (results) {
      const resultsString = results.hits.hits.map((obj) => obj._source.patient);
      logicPatientId[index] = {logic: join, id: resultsString};
      resolve();
    } else {
      logicPatientId[index] = {};
      resolve();
    }
  });
};
