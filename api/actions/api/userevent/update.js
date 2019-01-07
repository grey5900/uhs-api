/**
 * Created by isaac on 2016/3/31.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
import {roleAuthPromise as rap} from '../../lib/auth';
const UserEvent = mongoose.model('UserEvent');

export default function (req) {

  return rap(req, 'update', 'UserEvent', (resolve, reject) => {
    const {id, args} = req.body;
    args.update_time = getTime();
    UserEvent.findOneAndUpdate({_id: id}, args, (error) => {
      if (error) {
        console.log(error);
        reject({msg: error.message});
      } else {
        resolve({code: config.code.success});
      }
    });
  });
}
