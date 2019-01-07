/**
 * Created by isaac on 2/21/16.
 */

import mongoose from 'mongoose';
import {getIP, genToken} from '../../lib/auth';
import {roleAuthPromise as rap} from '../../lib/auth';
import config from '../../config';
const Admin = mongoose.model('Admin');

export default function register(req) {

    return rap(req, 'create', 'Admin', (resolve, reject) => {

    const hospital = req.headers['x-hospital'];
    const {email, password, name, role, nick_name, doctor} = req.body;
    if (email && password) {

      Admin.findOne({email: email}, (error, doc) => {
        if (doc) {
          reject({
            msg: '邮箱已被注册!'
          });
        } else {
          const user = new Admin();
          user.email = email;
          user.password = user.generateHash(password);
          user.name = name;
          user.role = role;
          user.hospital = hospital;
          user.nick_name = nick_name;
          user.doctor = doctor;
          user.deleted = false;
          user.save((error) => {
            if (error) {
              console.log(error);
              reject({msg: '注册失败!'});
            } else {
              delete user.password;
              resolve({
                code: config.code.success,
                user: user,
                access_token: genToken(user.id, getIP(req))
              });
            }
          });
        }
      });
    } else {
      reject({msg: '缺少参数!'});
    }
  });
}
