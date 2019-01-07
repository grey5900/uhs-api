/**
 * Created by yons on 16/3/14.
 */

import request from 'request';
import {getRandomArbitrary} from '../util';
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function _generateRandomValue(ref) {
  const min = ref.min_value;
  const max = ref.max_value;
  const minValue = parseFloat(min);
  const maxValue = parseFloat(max);
  if (isNumeric(minValue) && isNumeric(maxValue)) {
    return getRandomArbitrary(minValue * 0.8, maxValue * 1.2);
  } else if (isNumeric(minValue)) {
    return min;
  } else if (isNumeric(maxValue)) {
    return max;
  } else {
    return ref.min_value;
  }
}

module.exports = function (baseURL) {
  const typeURL = baseURL + '/sheettype/all';
  const url = baseURL + '/sheet/create';
  request({
    url: typeURL,
    method: 'GET',
    json: true
  }, (error, response, body) => {
    // console.log(error, body);
    // create 4 dummy sheet for patient
    for (var i = 0; i < 4; ++i) {
      body.data.forEach((type) => {
        const sheet = {};
        sheet.record = '56d071b6d97bcd188e2be37b';
        sheet.patient = '56d071b6d97bcd188e2be37b';
        sheet.hospital = '56d071b5d97bcd188e2be379';
        sheet.doctor = '56d146b7fcd3a25aecb4d2c7';
        sheet.type = type._id;
        sheet.report_time = new Date();

        const results = [];
        type.references.forEach((ref) => {

          results.push({
            name: ref.name,
            short_name: ref.short_name,
            value: _generateRandomValue(ref),
            reference: ref._id
          });
        });

        sheet.results = results;

        request({
          url: url,
          method: 'POST',
          json: true,
          body: sheet
        }, (err, resp, data) => {
          // console.log(err, data);
        });
      });
    }
  });
};
