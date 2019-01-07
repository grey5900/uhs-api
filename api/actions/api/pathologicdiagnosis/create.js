import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const PathologicDiagnosis = mongoose.model('PathologicDiagnosis');

export default function create(req) {

  return roleAuthPromise(req, 'read', 'PathologicDiagnosis', (resolve, reject) => {
    const info = {
      ...req.body,
      deleted: false
    };
    const pathologic = new PathologicDiagnosis(info);
    pathologic.save((error) => {
      if (error) {
        console.log(error.message);
        reject({msg: '添加失败！'});
      } else {
        resolve({
          code: config.code.success,
          data: pathologic
        });
      }
    });
  });
}
