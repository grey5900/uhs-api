/**
 * Created by chris on 3/28/16.
 */
import mongoose from 'mongoose';
import {getIP, genToken, roleAuthPromise as rap} from '../../lib/auth';

import config from '../../config';
import CryptoJS from 'crypto-js';
const Admin = mongoose.model('Admin');

export default function (req) {

  return rap(req, 'update', 'Admin', (resolve, reject) => {

    var {id} = req.body;

    if (id) {
      Admin.findOne({_id: id}, (error, doc) => {
        if (doc) {
          const sha1 = CryptoJS.SHA1;
          const password = sha1('123').toString().toUpperCase();
          Admin.update({_id: id},
            {password: doc.generateHash(password)},
            (error) => {
              if (error) {
                reject({msg: error.message});
              } else {
                resolve({
                  code: config.code.success,
                  access_token: genToken(id, getIP(req))
                });
              }
            });
        } else {
          reject({msg: '邮箱不存在!'});
        }
      });
    } else {
      reject({msg: '缺少参数！'});
    }
  });
}
