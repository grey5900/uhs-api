/**
 * Created by isaac on 16/7/10.
 */
import mongoose from 'mongoose';
import config from '../../config';
const DialysisSupply = mongoose.model('DialysisSupply');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function (req) {

  return rap(req, 'read', 'DialysisSupply', (resolve, reject) => {
    const {q} = req.query;
    const hospital = req.headers["x-hospital"];
    const exp = new RegExp(q, 'i');
    let args = {
      $or: [
        {name: exp},
        {code: exp}
      ]
    };
    DialysisSupply.find(args)
      .select('_id name')
      .exec((err, docs) => {
        if (err) {
          console.log(err);
          reject({msg: '查找失败！'});
        } else {
          resolve({
            code: config.code.success,
            success: true,
            results: docs
          });
        }
      });
  });
}
