/*
 * Copyright(c) omk 2016
 * Filename: guominlist.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期五, 19 八月 2016.
 */

import parse from 'csv-parse';
import superagent from 'superagent';
import fs from 'fs';
const Iconv = require('iconv').Iconv;
import mongoose from 'mongoose';
import '../../../models/AllergyDiagnosis';
const AllergyDiagnosis = mongoose.model('AllergyDiagnosis');
import {kHost, kUserAgent} from '../../../config';
import {sequencePromises} from '../../../lib/util';

export default function saveAllergyDiagnosis(chid, cookie, patientID) {

  return new Promise((resolve, reject) => {

    const file = fs.createWriteStream(__dirname + '/' + chid + '.csv');
    const request = superagent.get(kHost + 'sdoc.do?action=outputdata&rid=' + chid + '&tableid=gm');
    request.set('Cookie', cookie);
    request.set('user-agent', kUserAgent);
    request.set('Accept', 'application/x-csv');
    request.end((error, response) => {
      if (error) {
        console.log(error);
        reject({msg: 'get allergydiagnosis error'});
      } else {
        response.on('data', (data) => {
          file.write(data);
        }).on('end', () => {
          file.end();
          fs.readFile(__dirname + '/' + chid + '.csv', (err, data) => {
            if (err) {
              console.log(err);
              reject({msg: 'read csv file error'});
            } else {
              const gbk2utf8 = new Iconv('GBK', 'UTF8');
              const buffer = gbk2utf8.convert(data);
              parse(buffer, (error, output) => {
                if (error) {
                  reject();
                } else {
                  output.splice(0, 1);
                  if (output.length !== 0) {
                    const promises = output.map((line) => {
                      return new Promise((resolve, reject) => {
                        const info = {
                          patient: patientID,
                          create_time: line[0],
                          diagnosis_time: line[2],
                          classify: line[3].split('、'),
                          classify_other: line[4].split('、'),
                          devices: line[5].split('、'),
                          film: line[6].split('、'),
                          film_info: line[7],
                          devices_model: line[8],
                          disinfectant: line[9].split('、'),
                          disinfectant_info: line[10],
                          drug: line[11].split('、'),
                          antibiotic_name: line[12],
                          venofer_name: line[13],
                          dextrose_name: line[14],
                          heparin: line[16].split('、'),
                          drug_other: line[17],
                        };
                        const newAllergyDiagnosis = new AllergyDiagnosis(info);
                        newAllergyDiagnosis.save((err, doc) => {
                          if (err) {
                            console.log('save allergydiagnosis fall', err);
                            reject({msg: 'saveAllergyDiagnosis fail'});
                          } else {
                            resolve();
                          }
                        });
                      });
                    });
                    sequencePromises(promises).then(() => {
                      console.log('save allergydiagnosis success');
                      resolve();
                    });
                  } else {
                    resolve();
                  }
                }
              });
            }
          });
        });
      }
    });
  });
}
