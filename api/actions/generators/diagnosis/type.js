/**
 * Created by yons on 16/3/14.
 */
import request from 'request';

export default function init(baseURL) {
  const url = baseURL + '/diagnosistype/add';
  const references = require('./kidney');
  const args = {};
  args.name = '肾病诊断';
  args.references = references;
  request({
    url: url,
    method: 'POST',
    json: true,
    body: args
  }, (error, response, body) => {
    console.log(error, body);
  });
}
