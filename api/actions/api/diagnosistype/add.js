/**
 * Created by yons on 16/3/14.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getUID} from '../../lib/util';
import {roleAuthPromise as rap} from '../../lib/auth';
const DiagnosisType = mongoose.model('DiagnosisType');
const DiagnosisReference = mongoose.model('DiagnosisReference');

export default function add(req) {

  return rap(req, 'create', 'DiagnosisType', (resolve, reject) => {
    const info = req.body;
    const type = new DiagnosisType();
    type.deleted = false;
    type.name = info.name;
    type.creator = getUID(req);
    info.references.forEach((looper) => {
      const ref = new DiagnosisReference(looper);
      ref.deleted = false;
      ref.save();
      type.references.push(ref);
    });

    type.save((error) => {
      if (error) {
        reject({msg: error.message});
      } else {
        resolve({
          code: config.code.success,
          data: type
        });
      }
    });
  });
}
