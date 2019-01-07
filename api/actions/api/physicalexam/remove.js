/**
 * Created by yons on 16/3/12.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const PhysicalExam = mongoose.model('PhysicalExam');

export default function remove(req) {
  return rap(req, 'delete', 'PhysicalExam', (resolve, reject) => {
    const {id} = req.body;
    if (id) {
      PhysicalExam.findOneAndUpdate({_id: id}, {deleted: true}, (err) => {
        if (err) {
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
