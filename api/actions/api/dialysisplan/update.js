/**
 * Created by isaac on 16/8/24.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const DialysisPlan = mongoose.model('DialysisPlan');

export default function (req) {

  return roleAuthPromise(req, 'update', 'DialysisPlan', (resolve, reject) => {
    const {id, args} = req.body;
    DialysisPlan.findOneAndUpdate({_id: id}, args, (error) => {
      if (error) {
        console.log(error);
        reject({msg: '更新失败!'});
      } else {
        resolve({
          code: config.code.success
        });
      }
    });
  });
}
