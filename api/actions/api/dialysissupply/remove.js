/**
 * Created by isaac on 16/8/25.
 */
import mongoose from 'mongoose';
import config from '../../config';
const DialysisSupply = mongoose.model('DialysisSupply');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function (req) {
  return rap(req, 'delete', 'DialysisSupply', (resolve, reject) => {
    const {id} = req.body;
    DialysisSupply.remove({_id: id})
      .exec((err) => {
        if (err) {
          reject({msg: '查找失败'});
        } else {
          resolve({code: config.code.success});
        }
      });
  });
}
