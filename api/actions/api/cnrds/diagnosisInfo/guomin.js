/*
 * Copyright(c) omk 2016
 * Filename: guomin.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期二, 16 八月 2016.
 */

var cheerio = require('cheerio');
var fs = require('fs');
import mongoose from 'mongoose';
import '../../../models/AllergyDiagnosis';
const AllergyDiagnosis = mongoose.model('AllergyDiagnosis');

export default function saveAllergyDiagnosis(patientID) {
  fs.readFile('../diagnosisInfo/guomin.html', function(err, data) {
    if (err) {
      console.log(err);
    } else {

      const $ = cheerio.load(data);
      const texts = $('input[type=text]');
      const inputs = $('input[type=checkbox]');
      const radios = $('input[type=radio]');
      const result = {};
      result.diagnosis_time = texts[1].attribs.value;
      console.log('11', inputs[3]);
      for(var i = 3; i <= 5; i++) {
        if (inputs[i].attribs.checked === '') {
          if (result.classify) {
            result.classify.push(inputs[i].next.data);
          } else {
            result.classify = [inputs[i].next.data];
          }
        }
      }
      result.classify_other = [$('#qtgmfy').val()];
      for(var i = 6; i <= 7; i++) {
        if (inputs[i].attribs.checked === '') {
          if (result.devices) {
            result.devices.push(inputs[i].next.data);
          } else {
            result.devices = [inputs[i].next.data];
          }
        }
      }
      for(var i = 8; i <= 13; i++) {
        if (inputs[i].attribs.checked === '') {
          if (result.film) {
            result.film.push(inputs[i].next.data);
          } else {
            result.film = [inputs[i].next.data];
          }
        }
      }
      result.film_info = $('#qttxm').val();

      for(var i = 14; i <= 16; i++) {
        if (inputs[i].attribs.checked === '') {
          if (result.disinfectant) {
            result.disinfectant.push(inputs[i].next.data);
          } else {
            result.disinfectant = [inputs[i].next.data];
          }
        }
      }
      result.disinfectant_info = $('#qtxdj').val();
      result.devices_model = $('#xh').val();
      
      for(var i = 17; i <= 20; i++) {
        if (inputs[i].attribs.checked === '') {
          if (result.drug) {
            result.drug.push(inputs[i].next.data);
          } else {
            result.drug = [inputs[i].next.data];
          }
        }
      }
      result.antibiotic_name = $('#kss').val();
      result.venofer_name = $('#zttym').val();
      result.dextrose_name = $('#yxtgtym').val();
      for(var i = 0; i < 2; i++) {
        if(radios[i].attribs.checked === '') {
          result.heparin = [radios[i].next.data];
        }
      }
      result.drug_other = $('#qtywgm').val();
      console.log('222', result);
      result.patient = patientID;
      const newAllergyDiagnosis = new AllergyDiagnosis(result);
      newAllergyDiagnosis.save((error, doc) => {
        if (error) {
          console.log('error in save allergydiagnosis');
        } else {

          console.log(doc, 'doc');
        }
      });
    }
  });
}
