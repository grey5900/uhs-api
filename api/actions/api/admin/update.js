/**
 * Created by isaac on 2/21/16.
 */
import mongoose from 'mongoose';
import {roleAuthPromise as rap} from '../../lib/auth';
import {getTime} from '../../lib/util';
import config from '../../config';
const Admin = mongoose.model('Admin');

export default function update(req) {

  return rap(req, 'update', 'Admin', (resolve, reject) => {

    const id = req.body._id;
    const keys = ['name', 'mobile', 'wechat', 'qq', 'gender', 'birthday', 'coment', 'area', 'address_detail', 'zipcode', 'role', 'department', 'position', 'email', 'nick_name'];
    const params = {update_time: getTime()};
    for (var i = 0; i < keys.length; ++i) {
      const obj = req.body[keys[i]];
      if (typeof obj !== 'undefined') {
        params[keys[i]] = obj;
      }
    }

    if (id) {
      Admin.findOneAndUpdate({_id: id}, params, (err, doc) => {
        if (!doc) {
          reject({msg: '邮箱不存在！'});
        } else if (err) {
          reject({msg: '修改失败！'});
        } else {
          resolve({code: config.code.success});
        }
      })
    } else {
      reject({msg: '缺少参数！'});
    }
  });
}
