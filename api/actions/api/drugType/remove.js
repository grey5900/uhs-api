/**
 * Created by isaac on 16/3/4.
 */
import mongoose from 'mongoose';
import config from '../../config';
const DrugType = mongoose.model('DrugType');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function remove(req) {

  return rap(req, 'delete', 'DrugType', (resolve, reject) => {
    const {id} = req.body;
    if (id) {
      DrugType.findOneAndUpdate({id: id}, {deleted: true}, (err) => {
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
