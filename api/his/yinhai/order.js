import soap from 'soap';
import {soapURL} from './config';

export default function (hospitalID, doctorID, regID, patientID, argArray) {
  return new Promise((resolve, reject) => {
    doctorID = parseInt(doctorID, 10);
    argArray = argArray.map(({c_id, c_amount}) => ({c_id, c_amount}));
    const args = {
      arg0: hospitalID, arg1: doctorID, arg2: regID, arg3: patientID, arg4: JSON.stringify(argArray)
    };
    soap.createClient(soapURL, (err, client) => {
      if (err) {
        reject(err);
      } else {
        client.saveMTAdvice(args, (err, result) => {
          if (err) {
            reject(err);
          } else {
            const str = result.return;
            const response = JSON.parse(str);
            if (response.success) {
              resolve(response);
            } else {
              reject(response);
            }
          }
        });
      }
    });
  });
}
