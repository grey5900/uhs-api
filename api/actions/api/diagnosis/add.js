/**
 * Created by yons on 16/3/14.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getUID} from '../../lib/util';
const Diagnosis = mongoose.model('Diagnosis');
import {roleAuthPromise as rap} from '../../lib/auth';

export function create(req, args, resolve, reject) {
  const info = {
    ...args,
    deleted: false
  };
  const diagnosis = new Diagnosis(info);
  diagnosis.creator = getUID(req);

  diagnosis.save((error) => {
    if (error) {
      reject({msg: error.message});
    } else {
      resolve({
        code: config.code.success,
        data: diagnosis
      });
    }
  });
}

export default function add(req) {

  return rap(req, 'create', 'Diagnosis', (resolve, reject) => {
    const {patient} = req.body;
    if (patient) {
      create(req, req.body, resolve, reject);
    } else {
      reject({msg: '缺少参数！'});
    }
  });
}
