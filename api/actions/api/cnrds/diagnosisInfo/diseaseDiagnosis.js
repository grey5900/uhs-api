/*
 * Copyright(c) omk 2016
 * Filename: diseaseDiagnosis.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期二, 16 八月 2016.
 */

import cheerio from 'cheerio';
import superagent from 'superagent';
import mongoose from 'mongoose';
import '../../../models/PathologicDiagnosis';
const PathologicDiagnosis = mongoose.model('PathologicDiagnosis');
import {kHost, kUserAgent} from '../../../config';

export default function savePathologicDiagnosis(chid, cookie, patientID) {
  return new Promise((resolve, reject) => {
    const request = superagent.get(kHost + 'carehistory.do?action=showform&chid=' + chid + '&tableid=blzd&param=fx,1');
    request.set('Cookie', cookie);
    request.set('user-agent', kUserAgent);
    request.end((error, response) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        const pathologicHtml = response.text;
        const $ = cheerio.load(pathologicHtml);
        const inputs = $('input[type=checkbox]');
        const textInputs = $('input[type=text]');
        const result = {
          primary: [],
          secondary: [],
          genetic: [],
          tubule: []
        };
        result.date = textInputs[1].attribs.value;
        for (var i = 3; i <= 7; i++) {
          if (inputs[i].attribs.checked === '') {
            /*         console.log('checked', i, inputs[i]);*/
            result.classify = inputs[i].next.data;
          }
        }
        for (var i = 8; i <= 18; i++) {
          if (inputs[i].attribs.checked === '') {
            /*         console.log('checked', i, inputs[i]);*/
            result.primary.push(inputs[i].next.data);
          }
        }
        for (var i = 19; i <= 37; i++) {
          if (inputs[i].attribs.checked === '') {
            /*         console.log('checked', i, inputs[i]);*/
            result.secondary.push(inputs[i].next.data);
          }
        }
        for (var i = 38; i <= 44; i++) {
          if (inputs[i].attribs.checked === '') {
            /*         console.log('checked', i, inputs[i]);*/
            result.genetic.push(inputs[i].next.data);
          }
        }
        for (var i = 45; i <= 49; i++) {
          if (inputs[i].attribs.checked === '') {
            /*         console.log('checked', i, inputs[i]);*/
            result.tubule.push(inputs[i].next.data);
          }
        }
        result.primary_other = [$('#qtyfx').val()];
        result.secondary_other = [$('#qtzdms').val()];
        result.genetic_other = [$('#qtyc').val()];
        result.tubule_other = [$('#blzdms').val()];
        result.patient = patientID;
        const newPathologicDiagnosis = new PathologicDiagnosis(result);
        newPathologicDiagnosis.save((err) => {
          if (err) {
            reject();
          } else {
            resolve();
          }
        });
      }
    });
  });
}
