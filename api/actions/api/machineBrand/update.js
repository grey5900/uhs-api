/**
 * Created by isaac on 16/6/29.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
const MachineBrand = mongoose.model('MachineBrand');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function update(req) {

  return rap(req, 'update', 'MachineBrand', (resolve, reject) => {

    const {id, args} = req.body;
    if (id) {
      args.update_time = getTime();
      MachineBrand.findOneAndUpdate({_id: id}, args, (err) => {
        if (err) {
          reject({msg: '删除失败！'});
        } else {
          resolve({
            code: config.code.success
          });
        }
      });
    }
  });
}

