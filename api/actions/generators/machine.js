/**
 * Created by isaac on 16/2/28.
 */
import request from 'request';

function createMachines(url, hospitalID) {
  for (let i = 1; i <= 70; ++i) {
    request({
      url: url,
      method: 'POST',
      json: true,
      body: {
        model: '德国贝朗Dialog+',
        index: i,
        hospital: hospitalID
      }
    }, (error, response, body) => {
      console.log(error, response.statusCode, body);
    });
  }
}

export default function init(baseURL) {
  const hospitalURL = baseURL + '/hospital/all';
  const url = baseURL + '/machine/create';
  request({
    url: hospitalURL,
    method: 'GET',
    json: true
  }, (error, response, body) => {
    console.log(error, response.statusCode, body);
    const hospital = body.data[0];
    createMachines(url, hospital._id);
  });
}
