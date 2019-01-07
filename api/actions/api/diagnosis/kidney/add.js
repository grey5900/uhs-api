/**
 * Created by isaac on 16/6/22.
 */
import mongoose from 'mongoose';
import config from '../../../config';
import {getUID} from '../../../lib/util';
import {roleAuthPromise as rap} from '../../../lib/auth';
const KidneyDiagnosis = mongoose.model('KidneyDiagnosis');

export default function add(req) {

  return rap(req, 'create', 'KidneyDiagnosis', (resolve, reject) => {
    const {args} = req.body;
    var record = new KidneyDiagnosis(args);
    record.creator = getUID(req);
    record.deleted = false;
    record.save((err) => {
        if (err) {
          console.log(err);
          reject({msg: '创建失败！'});
        } else {
          resolve({
            code: config.code.success,
            data: record
          });
        }
      });
  });
}
