/**
 * Created by isaac on 16/4/18.
 */
import request from 'request';

const data = [
  {
    module: '低分子肝素钙',
    leaf: true
  },
  {
    module: '低分子肝素钠',
    leaf: true
  },
  {
    module: '促红素',
    leaf: true
  },
  {
    module: '铁剂',
    leaf: true
  },
  {
    module: '降压药',
    leaf: true
  },
  {
    module: 'PTH',
    leaf: true
  },
];

export default function init(baseURL) {
  const url = baseURL + '/drugtype/create';
  const user = '56d146b7fcd3a25aecb4d2c6';
  data.forEach((info) => {
    const {children} = info;
    if (children && children.length > 0) {
      request({
        url: url,
        method: 'POST',
        json: true,
        body: {
          name: info.module,
          creator: user
        }
      }, (error, response, body) => {
        console.log(error, response.statusCode, body);
        children.forEach((child) => {
          request({
            url: url,
            method: 'POST',
            json: true,
            body: {
              name: child.module,
              creator: user,
              super_type: body.data._id
            }
          }, (suberror, subresponse, subbody) => {
            console.log(suberror, subbody, child.module);
          });
        });
      });
    } else {
      request({
        url: url,
        method: 'POST',
        json: true,
        body: {
          name: info.module,
          creator: user
        }
      }, (error, response, body) => {
        console.log(error, response.statusCode, body);
      });
    }
  });
}
