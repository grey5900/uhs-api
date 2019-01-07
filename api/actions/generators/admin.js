/**
 * Created by jiang_mac on 16/1/21.
 */
import request from 'request';
import CryptoJS from 'crypto-js';

const adminList = [
  {
    email: 'lxm@omk.io',
    password: '123',
    name: 'lxm',
    role: 'superadmin'
  },
  {
    email: 'hcl@omk.io',
    password: '0okm9ijn',
    name: 'hcl',
    role: 'superadmin'
  }
];

export default function init(baseURL) {
  const url = baseURL + '/admin/register';
  const sha1 = CryptoJS.SHA1;
  adminList.forEach((info) => {
    info.password = sha1(info.password).toString().toUpperCase();
    request({
      url: url,
      method: 'POST',
      json: true,
      body: info
    }, (error, response, body) => {
      console.log(error, response.statusCode, body);
    })
  });
}
