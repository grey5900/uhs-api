/**
 * Created by isaac on 16/9/4.
 */
import request from 'request';
const roleList = [
  {name: '超级管理员', role: 'superadmin'},
  {name: '主任医师', role: 'director'},
  {name: '医生', role: 'doctor'},
  {name: '护士长', role: 'head-nurse'},
  {name: '护士', role: 'nurse'},
  {name: '网管', role: 'admin'}
];

export default function init(baseURL) {
  const url = baseURL + '/role/create';

  roleList.forEach((args) => {
    request({
      url,
      method: 'POST',
      json: true,
      body: args
    }, (error, response, body) => {
      console.log(error, response.statusCode, body);
    });
  });
}
