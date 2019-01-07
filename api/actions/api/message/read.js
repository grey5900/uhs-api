/**
 * Created by isaac on 16/7/11.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
import {getTime} from '../../lib/util';
const Message = mongoose.model('Message');

export default function (req) {

  return roleAuthPromise(req, 'read', 'Message', (resolve, reject) => {
    const {id} = req.body;
    Message.findOneAndUpdate({_id: id}, {has_read: true, update_time: getTime()}, (err) => {
      if (err) {
        console.log(err);
        reject({msg: err.message});
      } else {
        resolve({code: config.code.success});
      }
    });
  });
}
