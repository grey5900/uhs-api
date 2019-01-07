/**
 * Created by isaac on 2/19/16.
 */

import request from 'request';
const result = require('./mapHospital');

function createPatients(baseURL, patients, hospitalID) {
  const url = baseURL + '/patient/create';
  patients.forEach((obj) => {

    const patient = {};
    patient.real_name = obj.name;
    patient.user_name = obj.name;
    patient.person_id = obj.person_id;
    patient.mobile = obj.mobile;
    patient.address_detail = obj.address;
    patient.zipcode = obj.zipcode;

    patient.birthday = obj.birthday;
    patient.hospital = hospitalID;

    request({
      url: url,
      method: 'POST',
      json: true,
      body: patient
    }, (error, response, body) => {
      console.log(error, response.statusCode, body);
    });
  });
}

export default function init(baseURL) {
  const url = baseURL + '/hospital/create';
  console.log(url);
  const hospital = {
    name: '成都高新博力医院',
    province: '四川',
    city: '成都',
    area: '高新区',
    address: '高朋东路1号'
  };

  request({
    url: url,
    method: 'POST',
    json: true,
    body: hospital
  }, (error, response, body) => {
    const patients = result[hospital.name];
    createPatients(baseURL, patients, body.data._id);
  });
}
