/**
 * Created by isaac on 16/7/18.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Message = mongoose.model('Message');

export default function (req) {
  return roleAuthPromise(req, 'delete', 'Message', (resolve, reject) => {
    const {id} = req.body;
    Message.findOneAndRemove({_id: id}, (err) => {
      if (err) {
        console.log(err);
        reject({msg: err.message});
      } else {
        resolve({code: config.code.success});
      }
    });
  });
}
