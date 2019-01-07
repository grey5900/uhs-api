/**
 * Created by yons on 16/4/4.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const DialysisMachine = mongoose.model('DialysisMachine');

export default function list(req) {

  return roleAuthPromise(req, 'read', 'DialysisMachine', (resolve, reject) => {
    const hospital = req.headers["x-hospital"];
    if (hospital) {
      const args = {
        hospital,
        deleted: false
      };
      DialysisMachine.find(args)
                     .sort({index: 'asc'})
                     .populate('infectious_disease brand_reference')
                     .exec((error, docs) => {
                       if (error) {
                         reject({msg: error.message});
                       } else {
                         resolve({
                           code: config.code.success,
                           data: {
                             total: docs.length,
                             machines: docs
                           }
                         });
                       }
                     });
    } else {
      reject({msg: '缺少参数！'});
    }
  });
}
