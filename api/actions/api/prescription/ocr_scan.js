/*
 * Copyright(c) omk 2016
 * Filename: ocr_scan.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
const Prescription = mongoose.model('Prescription');
const fs        = require('fs');
const path      = require('path');
const multipart = require('connect-multiparty');
const xml2js    = require('xml2js');
const parser    = new xml2js.Parser({normalizeTags: true});

export default function ocr_scan(req) {

  return new Promise((resolve, reject) => {

    console.log("req:", req);
    console.log("------------------------------------------------------------");
    console.log("req.files:", req.files);
    var filename = req.files.files.originalFilename || path.basename(req.files.files.ws.path);
    console.log("filename:", filename);
    var targetPath = path.dirname(__filename) + '/public/' + filename;
    console.log("path:", targetPath);

    fs.createReadStream(req.files.files.path).pipe(fs.createWriteStream(targetPath));

    fs.readFile('../../../Table2.csv', 'utf8', function(err, response) {
      console.log("response_data: ", response);
      response = 'drug.name,drug.origin_info,amount,usage\r\n骨化三醇(盖三淳),正大海尔|0.25ug*10,30粒,用法用量:5mg|口服|2/7日\r\n厄贝沙坦片(安博维),赛诺菲|0.15g*7,28片,用法用量:0.15g|口服|2/日\r\n';

      var prescriptionDrugs = new CSV(response, { header: true}).parse();

      var prescription = {
        prescriptionDrugs : prescriptionDrugs,
        date              : '2015-10-27',
        doctor            : '杨丽南'
      };

      res.send({
        code : 200,
        msg  : {url: 'http://' + req.headers.host + '/' + filename},
        prescription: prescription
      });
    });
  });
}
