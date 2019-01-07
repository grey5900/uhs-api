/**
 * Created by isaac on 16/8/24.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const DialysisPlan = mongoose.model('DialysisPlan');

export const deepPopulatString = 'dialyzer needle perfusion items.drug items.supply items.sheettype';
export default function (req) {

  return roleAuthPromise(req, 'read', 'DialysisPlan', (resolve, reject) => {
    const {id} = req.query;
    DialysisPlan.findOne({_id: id})
      .deepPopulate(deepPopulatString)
      .exec((error, doc) => {
        if (error) {
          console.log(error);
          reject({msg: '查找失败!'});
        } else {
          resolve({
            code: config.code.success,
            data: doc
          });
        }
      });
  });
}
