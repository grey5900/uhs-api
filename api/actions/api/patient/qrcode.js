/**
 * Created by isaac on 16/3/1.
 */
import mongoose from 'mongoose';
import config, {protocol} from '../../config';
import {encode} from '../../lib/qrcode';
import {roleAuthPromise} from '../../lib/auth';

const Patient = mongoose.model('Patient');

export default function qrcode(req) {

  return roleAuthPromise(req, 'read', 'Patient', (resolve, reject) => {

    const {id} = req.query;
    if (id) {
      const result = encode(protocol, 'patient?id=' + id);
      resolve({
        code: config.code.success,
        data: result
      });
    } else {
      reject({msg: '缺少参数'});
    }
  });
}
