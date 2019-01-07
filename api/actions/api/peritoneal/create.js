/**
 * Created by isaac on 2/21/16.
 */
// import auth from '../../lib/auth';
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const Peritoneal = mongoose.model('Peritoneal');

export default function create(req) {

  return rap(req, 'create', 'Peritoneal', (resolve, reject) => {
    const info = {
      ...req.body.args
    };
    const peritoneal = new Peritoneal(info);
    peritoneal.save((error) => {
      if (error) {
        reject({msg: '腹透病史创建失败!'});
      } else {
        resolve({
          code: config.code.success,
          data: peritoneal
        });
      }
    });
  });
}
