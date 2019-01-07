import mongoose from 'mongoose';
import config from '../../config';
const AllergyDiagnosis = mongoose.model('AllergyDiagnosis');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function one(req) {
  return rap(req, 'read', 'AllergyDiagnosis', (resolve, reject) => {
    const {patientID} = req.query;
    if (patientID) {
      AllergyDiagnosis.findOne({patient: patientID})
        .select('-__v')
        .exec((err, doc) => {
          if (err) {
            reject({msg: '查找失败'});
          } else if (!doc) {
            resolve({
              code: config.code.success,
              data: {
                classify: [],
                classify_other: [],
                devices: [],
                film: [],
                film_info: '',
                devices_model: '',
                disinfectant: [],
                disinfectant_info: '',
                heparin: [],
                drug: [],
                antibiotic_name: '',
                venofer_name: '',
                dextrose_name: '',
                drug_other: ''
              }
            })
          } else {
            resolve({
              code: config.code.success,
              data: doc
            })
          }
        });
    }
  });
}
