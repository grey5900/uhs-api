/**
 * Created by yons on 16/3/12.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
const PhysicalExam = mongoose.model('PhysicalExam');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function update(req) {

  return rap (req, 'update', 'PhysicalExam', (resolve, reject) => {
    const id = req.body._id;
    if (id) {
      const args = {... req.body};
      args.update_time = getTime();
      delete args.id;
      PhysicalExam.findOneAndUpdate({_id: id}, args, (err) => {
        if (err) {
          console.log(err);
          reject({msg: '更新失败！'});
        } else {
          resolve({code: config.code.success});
        }
      });
    } else {
      reject({msg: '缺少参数！'});
    }
  });
}
