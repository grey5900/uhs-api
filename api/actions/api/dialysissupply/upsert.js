
import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
const DialysisSupply = mongoose.model('DialysisSupply');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function update(req) {

  return rap(req, 'update', 'DialysisSupply', (resolve, reject) => {

    let supply = req.body;
    const hospital = req.headers['x-hospital'];
    const {_id} = supply;
    if (_id) {
      DialysisSupply.findOneAndUpdate({_id}, supply, (err, doc) => {
        if (err) {
          reject({msg: '操作失败！'});
        } else {
          resolve({code: config.code.success});
        }
      });
    } else {
      supply.hospital = hospital;
      const dialysisSupply = new DialysisSupply(supply);
      dialysisSupply.update_time = getTime();
      dialysisSupply.save((error) => {
        if (error) {
          reject({msg: '保存失败'});
        } else {
          resolve({code: config.code.success});
        }
      });
    }
  });
}
