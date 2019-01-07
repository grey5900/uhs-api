/**
 * Created by yons on 16/3/26.
 */
import request from 'request';
import yod from 'yod-mock';

yod.type('Doctor', {
  qualification: '@String',
  person_id: '@String',
  name: '@Name',
  hospital: '56d071b5d97bcd188e2be379',
  department: '肾内科',
  is_charger: false,
  mobile: '@Tel',
  email: '@Email',
  wechat: '@String',
  qq: '@Tel',
  gender: '@Gender',
  birthday: '@Date("YYYY-MM-DD", "1966-1-1", "1994-1-1")'
});

export default function (baseURL) {
  const url = baseURL + '/doctor/create';
  const doctors = yod('@Doctor.repeat(20, 30)');

  doctors.forEach((info) => {
    request({
      url: url,
      method: 'POST',
      json: true,
      body: info
    }, (error, response, body) => {
      console.log(error, response.statusCode, body);
    });
  });
}