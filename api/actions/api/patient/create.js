/*
 * Copyright(c) omk 2016
 * Filename: create.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期五, 26 二月 2016.
 */
import mongoose from 'mongoose';
import fs from 'fs';
import config from '../../config';
import {decodeBase64Image, randomString} from '../../lib/util';
import {roleAuthPromise} from '../../lib/auth';

const Patient = mongoose.model('Patient');
const Medicare = mongoose.model('Medicare');
const Record = mongoose.model('Record');
const Contact = mongoose.model('Contact');
const File = mongoose.model('File');
const Outcome = mongoose.model('Outcome');

function savePatient(obj, patient, hospital, medicare, number, record, contact, info, reject, resolve) {
  obj.birthday = new Date(patient.birthday);
  //
  if (number) {
    const newMedicare = new Medicare(medicare);
    newMedicare.patient = obj;
    newMedicare.save((error) => {
      if (error) {
        console.log('medicare :', error);
      }
    });
    obj.medicare = newMedicare;
  }

  const newRecord = new Record();
  newRecord.patient = obj;
  newRecord.hospital = hospital;
  newRecord.fistula_file1 = info.fistula_file1;
  newRecord.fistula_file2 = info.fistula_file2;
  newRecord.fistula_file3 = info.fistula_file3;
  Object.assign(newRecord, record);
  newRecord.save((error) => {
    if (error) {
      console.log('record:', error);
    }
  });
  obj.record = newRecord;

  if (contact) {
    const newContact = new Contact(contact);
    newContact.save((error) => {
      if (error) {
        console.log('contact :', error);
      }
    });
    obj.contact = newContact;
  }
  // save outcome
  const {outcome} = info;
  if (outcome) {
    const newOutcome = new Outcome(outcome);
    newOutcome.patient = obj.id;
    obj.outcome = newOutcome.id;
    newOutcome.save((error) => {
      if (error) {
        console.log(error);
      }
    });
  }
  obj.save((error) => {
    if (error) {
      console.log(error);
      reject({
        msg: '添加失败！'
      });
    } else {
      const id = obj._id;
      Patient.findOne({_id: id, deleted: false})
        .exec((err, doc) => {
          if (err) {
            console.log(err);
            reject({msg: err.message});
          } else {
            resolve({
              code: config.code.success,
              data: doc
            });
          }
        });
    }
  });
}

export default function create(req) {

  return roleAuthPromise(req, 'create', 'Patient', (resolve, reject) => {
    const info = req.body;
    const {patient, medicare, record, contact} = info;
    const person_id = patient.person_id;
    const number = medicare.number;
    const hospital = req.headers['x-hospital'];
    if (person_id) {
      Patient.findOne({person_id}, (err, doc) => {
        if (doc) {
          reject({msg: '该用户已存在！'});
        } else {
          patient.deleted = false;
          patient.hospital = hospital;
          const {avatarData, ...rest} = patient;
          const obj = new Patient(rest);
          // has avatar, save it to file
          if (avatarData) {
            const buffer = decodeBase64Image(avatarData);
            const imageName = `${randomString()}.png`;
            const imagePath = `${config.uploadFolder}/${imageName}`;
            fs.writeFile(imagePath, buffer.data, (err) => {
              if (err) {
                console.log(err);
                reject({msg: '保存头像失败!'});
              } else {
                const file = new File();
                file.name = imageName;
                file.original_name = imageName;
                file.size = buffer.data.length;
                file.type = 'png';
                file.path = imagePath;
                file.save((error) => {
                  if (error) {
                    reject({msg: '保存头像失败!'});
                  }
                });
                obj.avatar = file._id;
                savePatient(obj, patient, hospital, medicare, number, record, contact, info, reject, resolve);
              }
            });
          } else {
            savePatient(obj, patient, hospital, medicare, number, record, contact, info, reject, resolve);
          }
        }
      });
    } else {
      reject({msg: '缺少参数！（需要身份证号）'});
    }
  });
}

