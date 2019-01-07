/**
 * Created by Grey on 16/6/23.
 */
import mongoose from 'mongoose';
import config from '../../config';
const MachineBrand = mongoose.model('MachineBrand');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function remove(req) {

  return rap(req, 'delete', 'MachineBrand', (resolve, reject) => {

    const id = req.body.id;
    if (id) {
      MachineBrand.findOneAndUpdate({_id: id}, {deleted: true}, (err) => {
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
