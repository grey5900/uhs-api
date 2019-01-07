/**
 * Created by isaac on 2016/3/18.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
import {roleAuthPromise as rap} from '../../lib/auth';
const Contact = mongoose.model('Contact');

export default function update(req) {
  return rap(req, 'update', 'Contact', (resolve, reject) => {

    const {id, args} = req.body;
    args.update_time = getTime();
    if (id) {
      Contact.findOneAndUpdate({_id: id}, args, (err) => {
        if (!doc || err) {
          reject({msg: '更新失败！'});
        } else {
          resolve({code: config.code.success});
        }
      });
    } else {
      reject({msg: '缺少参数!'});
    }
  });
}
