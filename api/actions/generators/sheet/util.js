/**
 * Created by isaac on 12/2/15.
 */
import request from 'request';

module.exports = function (info, baseURL) {
  const url = baseURL + '/sheettype/create';
  request({
    url: url,
    method: 'POST',
    json: true,
    body: info
  }, (error, response, body) => {
    console.log(error, response.statusCode, body);
  });
};