import mongoose from 'mongoose';
import config from '../../config';
const AllergyDiagnosis = mongoose.model('AllergyDiagnosis');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function create(req) {

  return rap(req, 'create', 'AllergyDiagnosis', (resolve, reject) => {
    const info = {
      ...req.body,
      deleted: false
    };
    const allergy = new AllergyDiagnosis(info);
    allergy.save((error) => {
      if (error) {
        console.log(error);
        reject({msg: '添加失败！'});
      } else {
        resolve({
          code: config.code.success,
          data: allergy
        });
      }
    });
  });
}
