/*
 * Copyright(c) omk 2016
 * Filename: ocr_scan.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const Sheet = mongoose.model('Sheet');
const fs        = require('fs');
const path      = require('path');
const multipart = require('connect-multiparty');
const xml2js    = require('xml2js');
const parser    = new xml2js.Parser({normalizeTags: true});

export default function ocr_scan(req) {

  return rap(req, 'create', 'Sheet', (resolve, reject) => {

    const filename = req.files.files.originalFilename || path.basename(req.files.files.ws.path);
    const targetPath = path.dirname(__filename) + '/public/' + filename;

    fs.createReadStream(req.files.files.path).pipe(fs.createWriteStream(targetPath));
    console.log("__dirname", __dirname);
    var reg = /.\w+$/;
    var xmlFile = __dirname + '/../../ocr-data/sheet/done/' + filename.replace(reg,'.xml');
    console.log("file name", xmlFile);
    fs.readFile(xmlFile, 'utf8', function(err, response) {
      console.log("response_data: ", response);

      parser.parseString(response, function (error, result) {
        console.log(result);
        res.send({
          code : 200,
          msg  : {url: 'http://' + req.headers.host + '/' + filename},
          sheet: result['form:documents']._sheet[0]
        });
      });
    });
  });
}
