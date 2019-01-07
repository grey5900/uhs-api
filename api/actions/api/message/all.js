/**
 * Created by isaac on 16/5/21.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Message = mongoose.model('Message');

export default function(req) {
  return roleAuthPromise(req, 'read', 'Message', (resolve, reject) => {
    const {receiver} = req.query;
    Message.find({receiver})
      .sort({create_time: -1})
      .exec((err, docs) => {
      if (err) {
        console.log(err);
        reject({msg: err.message});
      } else {
        resolve({
          code: config.code.success,
          data: docs
        });
      }
    });
  });
}
