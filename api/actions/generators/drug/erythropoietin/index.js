/**
 * Created by jiang_mac on 16/5/31.
 */
import request from 'request';
import data from './typeAndDrug';

export default function init(baseURL) {
  const typeUrl = baseURL + '/drugtype/create';
  const drugUrl = baseURL + '/drug/create';
  const companyUrl = baseURL + '/company/create';

  data.forEach((typeInfo) => {
    const {drug} = typeInfo;
    const typeData = {name: typeInfo.name}
    requestFunc(typeUrl, typeData, (error, response, body) => {
      drug.forEach((drugInfo) => {
        const {company} = drugInfo;
        if (company) {
          const companyData = {name: company};
          requestFunc(companyUrl, companyData, (companyError, companyResponse, companyBody) => {
            delete drugInfo.company;
            const drugData = {...drugInfo, type: body.data._id, company: companyBody.data._id}
            requestFunc(drugUrl, drugData);
          });
        } else {
          const drugData = {...drugInfo, type: body.data._id,}
          requestFunc(drugUrl, drugData);
        }
      });
    });
  });
}

function requestFunc(url, data, cb) {
  request({
    url,
    method: 'POST',
    json: true,
    body: data
  }, (error, response, body) => {
    if (cb) {
      cb(error, response, body)
    }
  })
}
