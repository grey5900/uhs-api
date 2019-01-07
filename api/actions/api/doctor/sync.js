/**
 * Created by isaac on 16/7/12.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const Doctor = mongoose.model('Doctor');

// field map
const fm = {
  userid: 0, //姓名
  username: 1 //身份证
};

function mapToDoctor(obj) {
  return {
    name: obj[fm.username],
    yh_doctor_id: obj[fm.userid]
  }
}

export function syncDoctor(result, resolve, reject) {
  const callback = (error) => {
    if (error) {
      console.log(error);
      reject({msg: error.message});
    } else {
      resolve({code: config.code.success});
    }
  };
  const {rows} = result;
  if (rows.length > 0) {
    // only get the first record.
    const obj = rows[0];
    const info = mapToPatient(obj);
    const {yh_doctor_id, name} = info;
    Doctor.findOne({yh_doctor_id}, (error, doctor) => {
      if (error) {
        console.log(error);
        reject({msg: error.message});
      } else if (doctor) {
        doctor.name = name;
        doctor.save(callback);
      } else {
        const newDoctor = new Doctor(info);
        newDoctor.save(callback);
      }
    });
  } else {
    resolve({code: config.code.success});
  }
}

export default function (req, params, ctx) {
  return rap(req, 'update', 'Doctor', (resolve, reject) => {
    const {his: {sync, connection}} = ctx;
    sync.doctor(connection).then((result) => syncDoctor(result, resolve, reject),
      (error) => {
        console.log(error);
        reject({msg: '同步医生失败!'});
      });
  });
}
