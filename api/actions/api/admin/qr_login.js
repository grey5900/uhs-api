/**
 * Created by isaac on 16/7/13.
 */
import mongoose from 'mongoose';
import {getIP, genToken} from '../../lib/auth';
import config from '../../config';
const Admin = mongoose.model('Admin');

export default function(req) {

  return new Promise((resolve, reject) => {
    // make async call to database
    const {id} = req.body;
    const process = () => {
      Admin.findOne({_id: id})
        .populate('hospital doctor')
        .exec((error, doc) => {
          if (error) {
            console.log(error);
            reject({msg: '登陆失败!'});
          } else {
            if (doc) {
              doc.password = null;
              req.session.user = doc;

              resolve({
                code: config.code.success,
                user: doc,
                access_token: genToken(doc.id, getIP(req))
              });
            } else {
              reject({msg: '账号不存在'});
            }
          }
        });
    };

    if (id) {
      process();
    } else {
      reject({msg: '缺少参数'});
    }
  });
}
