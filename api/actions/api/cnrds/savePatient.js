/**
 * Created by isaac on 16/8/9.
 */
import superagent from 'superagent';
import cheerio from 'cheerio';
import mongoose from 'mongoose';
const Patient = mongoose.model('Patient');
const Record = mongoose.model('Record');
const Contact = mongoose.model('Contact');
import {kHost, kUserAgent} from '../../config';

export default function savePatient(cookie, user, patid) {
  return new Promise((resolve, reject) => {

    const request3 = superagent.get(kHost + 'carehistory.do?action=showchrecords&patid=' + patid);
    request3.set('Cookie', cookie);
    request3.set('user-agent', kUserAgent);
    request3.end((error, response) => {
      if (error) {
        reject({msg: 'get patient response fail'});
      } else {
        const $ = cheerio.load(response.text);
        const tds = $('td');
        const name = $(tds[1]).text();
        const pinyinName = $(tds[3]).text();
        const gender = $(tds[5]).text();
        const birthday = $(tds[7]).text();
        const zyh = $(tds[9]).text();
        const personID = $(tds[11]).text();
        const mzh = $(tds[13]).text();

        const address = $(tds[21]).text();
        const contactor = $(tds[23]).text();
        const firstTreatment = $(tds[25]).text();
        const contactPhone = $(tds[27]).text();
        /* const deathTime = $(tds[29]).text();*/
        const mobile = $(tds[31]).text();
        const hospital = user.hospital ? user.hospital._id : '';
        const doctor = user.doctor ? user.doctor._id : '';
        /* const doctorName = $(tds[42]).text();
         * const hospitalName = $(tds[44]).text();*/
        const patient = {real_name: name,
                         pinyin: pinyinName,
                         cnrds_id: patid,
                         gender: gender === '女' ? 'Female' : 'Male',
                         birthday,
                         inhospital_number: zyh,
                         person_id: personID,
                         outpatient_number: mzh,
                         address_detail: address,
                         hospital,
                         doctor,
                         mobile};
        const record = {
          doctor,
          hospital,
          first_treat_time: firstTreatment
        };
        const contact = {
          name: contactor,
          phone: contactPhone,
          mobile
        };
        Patient.findOne({cnrds_id: patid}, (err, doc) => {
          if (err) {
            reject({msg: 'find patient error'});
          } else if (!doc) {
            const newRecord = new Record(record);
            const newContact = new Contact(contact);
            newRecord.save((err, recordDoc) => {
              if (err) {
                reject({msg: 'save Record error'});
              } else {
                newContact.save((err, contactDoc) => {
                  if (err) {
                    reject({msg: 'save contact error'});
                  } else {
                    patient.record = recordDoc._id;
                    patient.contact = contactDoc._id;
                    const newPatient = new Patient(patient);
                    newPatient.save((err, patientDoc) => {
                      if (err) {
                        reject({msg: 'save patient error'});
                      } else {
                        Record.findOneAndUpdate({_id: recordDoc._id}, {patient: patientDoc._id}, (err, doc) => {
                          if (err) {
                            reject({msg: 'find record error'});
                          } else {
                            resolve(patientDoc._id);
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          } else {
            Patient.findOneAndUpdate({cnrds_id: patid}, patient, (err, doc) => {
              if (err) {
                reject({msg: 'find patient error'});
              } else {
                resolve(doc._id);
              }
            });
          }
        });
      }
    });
  });
}
