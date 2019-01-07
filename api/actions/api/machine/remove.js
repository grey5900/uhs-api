/**
 * Created by isaac on 16/3/2.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const DialysisMachine = mongoose.model('DialysisMachine');

export default function (req) {

  return roleAuthPromise(req, 'delete', 'DialysisMachine', (resolve, reject) => {

    const {id} = req.body;
    if (id) {
      DialysisMachine.findOneAndRemove({_id: id}, (err) => {
        if (err) {
          console.log(err);
          reject({msg: '删除失败！'});
        } else {
          resolve({code: config.code.success});
        }
      });
    } else {
      reject({msg: '缺少参数！'});
    }
  });
}
