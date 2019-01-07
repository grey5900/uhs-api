/*
 * Copyright(c) omk 2016
 * Filename: update.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期五, 26 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import fs from 'fs';
import {decodeBase64Image, randomString, isEmpty, getTime} from '../../lib/util';
import {judge} from '../message/observers';
import constants from '../message/observers/constants';
import {roleAuthPromise} from '../../lib/auth';

const Patient = mongoose.model('Patient');
const Medicare = mongoose.model('Medicare');
const Contact = mongoose.model('Contact');
const Record = mongoose.model('Record');
const File = mongoose.model('File');
const Outcome = mongoose.model('Outcome');

function createRecord(patient, hospital, info) {
  const newRecord = new Record({patient: patient.id, hospital, ...info});
  newRecord.save((error) => {
    if (error) {
      console.log('record:', error);
    }
  });
  patient.record = newRecord.id;
}

export default function update(req, params, ctx) {

  return roleAuthPromise(req, 'update', 'Patient', (resolve, reject) => {
    const hospital = req.headers['x-hospital'];
    const {id, patient, medicare, contact, outcome, avatar, record} = req.body;
    if (id) {
      Patient.findById(id, (error, doc) => {
        if (error) {
          console.log(error);
          reject({msg: error.message});
        } else if (!doc) {
          reject({msg: '患者不存在!'});
        } else {
          const update_time = getTime();
          // update patient info
          if (!isEmpty(patient)) {
            Object.assign(doc, patient);
          }
          // update medicare
          if (!isEmpty(medicare)) {
            if (doc.medicare) {
              medicare.update_time = update_time;
              Medicare.findOneAndUpdate({_id: doc.medicare}, medicare, (error) => {
                if (error) {
                  console.log(error);
                }
              });
            } else {
              const newMedicare = new Medicare(medicare);
              newMedicare.save((error) => {
                if (error) {
                  console.log(error);
                }
              });
              doc.medicare = newMedicare.id;
              doc.save();
            }
          }
          // update contact
          if (!isEmpty(contact)) {
            if (doc.contact.length > 0) {
              contact.update_time = update_time;
              Contact.findOneAndUpdate({_id: doc.contact[0]}, contact, (error) => {
                if (error) {
                  console.log(error);
                }
              });
            } else {
              const newContact = new Contact(contact);
              newContact.save((error) => {
                if (error) {
                  console.log(error);
                }
              });
              doc.contact.push(newContact.id);
              doc.save();
            }
          }
          // update outcome
          if (!isEmpty(outcome)) {
            if (doc.outcome) {
              outcome.update_time = update_time;
              Outcome.findOneAndUpdate({_id: doc.outcome}, outcome, (error) => {
                if (error) {
                  console.log(error);
                }
              });
            } else {
              const newOutcome = new Outcome(outcome);
              newOutcome.patient = doc.id;
              doc.outcome = newOutcome.id;
              newOutcome.save((error) => {
                if (error) {
                  console.log(error);
                }
              });
            }
          }
          // update avatar if have one
          if (avatar) {
            const buffer = decodeBase64Image(avatar);
            const imageName = `${randomString()}.png`;
            const imagePath = `${config.uploadFolder}/${imageName}`;
            fs.writeFile(imagePath, buffer.data, (err) => {
              if (err) {
                console.log(err);
              } else {
                const file = {};
                file.name = imageName;
                file.original_name = imageName;
                file.size = buffer.data.length;
                file.type = 'png';
                file.path = imagePath;
                console.log('file:', file);
                const avatarRecord = new File(file);
                avatarRecord.save();
                doc.avatar = avatarRecord.id;
                doc.save();
              }
            });
          }
          if (!isEmpty(record)) {
            if (doc.record) {
              // update record
              Record.findOneAndUpdate({_id: doc.record}, record)
                .exec((error) => {
                  if (error) {
                    console.log(error);
                  }
                });
            } else {
              // create new record
              createRecord(doc, hospital, record);
            }
          }
          // save patient
          doc.update_time = update_time;
          doc.save((error) => {
            if (error) {
              console.log(error);
              reject({msg: error.message});
            } else {
              judge(constants.patient, req, {patient: doc, ...ctx});
              resolve({code: config.code.success});
            }
          });
        }
      });
    } else {
      reject({msg: '缺少参数！'});
    }
  });
}
