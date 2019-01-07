/**
 * Created by isaac on 2016/3/21.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {create as createDiagnosis} from '../diagnosis/add';
import {roleAuthPromise} from '../../lib/auth';
const DiseaseRecord = mongoose.model('DiseaseRecord');

function _success(req, record, array, index, result, resolve, reject) {
  record.save((error, doc) => {
    if (error) {
      console.log(error.message);
      reject({msg: name + '添加失败！'});
    } else {
      result.push(doc);

      if (index === array.length - 1) {
        resolve({
          code: config.code.success,
          data: result
        });
      } else {
        _create(req, array, index + 1, result, resolve, reject);
      }
    }
  });
}

function _create(req, array, _index, result, resolve, reject) {
  const index = parseInt(_index);
  const args = array[index];
  const {name, start_time, end_time, tags, symptom, description, diagnosis, patient} = args;

  const record = new DiseaseRecord();
  record.patient = patient._id;
  record.name = name;
  record.start_time = start_time;
  record.end_time = end_time;
  record.tags = tags;
  record.symptom = symptom;
  record.description = description;
  record.deleted = false;
  if (diagnosis) {
    createDiagnosis(req, diagnosis, (resultDiagnosis) => {
      record.diagnosis = resultDiagnosis.data.id;
      _success(req, record, array, index, result, resolve, reject);
    }, reject);
  } else {
    _success(req, record, array, index, result, resolve, reject);
  }
}

export default function create(req) {

  return roleAuthPromise(req, 'create', 'DiseaseRecord', (resolve, reject) => {
    const {args} = req.body;
    const result = [];
    _create(req, args, 0, result, resolve, reject);
  });
}
