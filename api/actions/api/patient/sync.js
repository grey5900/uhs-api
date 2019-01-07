/**
 * Created by isaac on 16/7/10.
 */
import mongoose from 'mongoose';
import Record from '../../models/Record';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';

const Hospital = mongoose.model('Hospital');
const Patient = mongoose.model('Patient');
const Contact = mongoose.model('Contact');
const Medicare = mongoose.model('Medicare');
const TreatPlan = mongoose.model('TreatPlan');

// field map
const fm = {
  xm: 0, //姓名
  sfz: 1, //身份证
  xb: 2, //性别
  nl: 3, //年龄
  nldw: 4, //年龄单位
  csrq: 5, //出生日期
  lxr: 6, //联系人
  lxdh: 7, //联系电话
  dz: 8, //地址
  dz_a: 9, //省
  dz_b: 10, //市
  dz_c: 11, //区/县
  dz_d: 12, //乡镇
  ybkh: 13, //医保卡号
  jzh: 14, //就诊号
  jzid: 15, //就诊ID
  brid: 16, //病人ID,治疗周期内唯一
  yyid: 17 //医院ID
};

function mapToPatient(obj) {
  return {
    real_name: obj[fm.xm] || '',
    person_id: obj[fm.sfz] || '',
    gender: obj[fm.xb] === '男' ? 'Male' : 'Female',
    age: obj[fm.nl],
    birthday: obj[fm.csrq],
    mobile: obj[fm.lxdh],
    area: obj[fm.dz_a] || '',
    address_detail: obj[fm.dz] || '',
    jzh: obj[fm.jzh]
  }
}

function mapHISInfoFrom(obj) {
  return {
    jzid: obj[fm.jzid],
    brid: obj[fm.brid],
    yyid: obj[fm.yyid]
  }
}

function mapToContact(obj) {
  return {
    name: obj[fm.lxr],
    mobile: obj[fm.lxdh]
  };
}

export function syncPatient(result, resolve, reject) {
  const {rows} = result;
  if (rows.length > 0) {
    // only get the first record.
    Hospital.findOne({}, (error, hospital) => {
      if (error) {
        reject({msg: 'fail to find hospital!'});
      } else {
        rows.forEach((obj) => {
          const info = mapToPatient(obj);
          const {jzh} = info;
          const medicareNumber = obj[fm.ybkh];
          Patient.findOne({jzh}, (error, patientDoc) => {
            console.log(error, patientDoc);
            if (error) {
              console.log(error);
              reject({msg: error.message});
            } else if (patientDoc) {
              // will update patient
              //
              Object.assign(patientDoc, info);
              patientDoc.yh_his = mapHISInfoFrom(obj);
              if (patientDoc.medicare) {
                Medicare.findOneAndUpdate(patientDoc.medicare, {number: medicareNumber})
                  .exec((error) => {
                    console.log(error);
                  });
              }
              patientDoc.save((error) => {
                if (error) {
                  console.log(error);
                  reject({msg: error.message});
                } else {
                  resolve({
                    code: config.code.success,
                    data: patientDoc
                  });
                }
              });
              console.log('update patient', jzh);
            } else {
              // will create new patient
              //
              const patient = new Patient(info);
              patient.hospital = hospital;

              // create record info
              //
              const record = new Record({hospital});
              record.save();
              patient.record = record;

              // create medicare info
              //
              const medicare = new Medicare();
              if (medicareNumber) {
                medicare.number = medicareNumber;
              }
              medicare.save((error) => {
                console.log(error);
              });
              patient.medicare = medicare.id;
              // create contact info
              //
              const contactInfo = mapToContact(obj);
              const contact = new Contact(contactInfo);
              contact.save();
              patient.contact.push(contact);
              patient.yh_his = mapHISInfoFrom(obj);
              patient.save((error) => {
                if (error) {
                  console.log(error);
                  reject({msg: error.message});
                } else {
                  resolve({
                    code: config.code.success,
                    data: patient
                  });
                }
              });
              console.log('save new patient', jzh);
            }
          });
        });
      }
    });
  } else {
    resolve({code: config.code.success});
  }
}

export default function (req, params, ctx) {

  return roleAuthPromise(req, 'update', 'Patient', (resolve, reject) => {

    const {jzh} = req.query;
    if (jzh) {
      const {his: {sync, connection}} = ctx;
      sync.patient(connection, jzh).then((result) => syncPatient(result, resolve, reject),
        (error) => {
          console.log(error);
          reject({msg: '同步患者失败!'});
        });
    } else {
      reject({msg: '缺少参数!'});
    }
  });
}


export function syncAll(req, params, ctx) {
  return roleAuthPromise(req, 'update', 'Patient', (resolve, reject) => {
    const {his: {sync, connection}} = ctx;
    sync.allPatient(connection).then((result) => syncPatient(result, resolve, reject),
      (error) => {
        console.log(error);
        reject({msg: '同步患者失败!'});
      });
  });
}
