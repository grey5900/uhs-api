/**
 * Created by isaac on 16/5/24.
 */
import request from 'request';

const typeList = [
  {name: 'HIV'},
  {name: '梅毒'},
  {name: '乙肝'},
];

export default function init(baseURL) {
  const url = baseURL + '/diseasetype/create';

  typeList.forEach((info) => {
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