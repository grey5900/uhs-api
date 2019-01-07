/**
 * Created by isaac on 2016/3/31.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const UserEvent = mongoose.model('UserEvent');

export default function (req) {

  return rap(req, 'create', 'UserEvent', (resolve, reject) => {
    const info = {
      ...req.body,
      deleted: false
    };
    const event = new UserEvent(info);
    event.save((error, doc) => {
      if (error) {
        console.log(error);
        reject({msg: error.message});
      } else {
        resolve({
          code: config.code.success,
          event: doc
        });
      }
    });
  });
}
