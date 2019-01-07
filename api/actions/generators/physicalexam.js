/**
 * Created by isaac on 3/15/16.
 */
import request from 'request';
import {getRandomArbitrary, getRandomInt} from './util';

function dummy() {
  const patients = ['56d071b6d97bcd188e2be37a', '56d071b6d97bcd188e2be37b', '56d071b6d97bcd188e2be37c', '56d071b6d97bcd188e2be37d'];
  const admin = '56d146b7fcd3a25aecb4d2c6';
  const result = [];
  for (var i = 0; i < 12; ++i) {
    result.push({
      patient     : patients[getRandomInt(0, patients.length)],
      height      : getRandomArbitrary(160, 180),
      weight      : getRandomArbitrary(56, 80),
      girth       : getRandomArbitrary(60, 100), // 腰围
      hip         : getRandomArbitrary(70, 100), // 臀围
      skin_thick  : getRandomArbitrary(1, 4), // 皮褶厚度
      heart_rate  : getRandomArbitrary(60, 90), // 心率
      blood_pressure_high: getRandomArbitrary(110, 140), // 血压高压
      blood_pressure_low: getRandomArbitrary(60, 110), // 血压低压

      exam_time   : new Date(), // 检查时间
      conclusion  : '------', //评估结论
      period      : '4', //周期

      creator     : admin
    });
  }
  return result;
}

function create(info, url) {
  request({
    url: url,
    method: 'POST',
    json: true,
    body: info,
  }, (error, response, body) => {
    console.log(error, body);
  });
}

export default function init(baseURL) {
  const url = baseURL + '/physicalexam/create';
  const infos = dummy();
  infos.forEach((info) => {
    create(info, url);
  });
}
