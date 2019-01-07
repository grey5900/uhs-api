/**
 * Created by isaac on 16/8/24.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const DialysisPlan = mongoose.model('DialysisPlan');

export default function (req) {

  return roleAuthPromise(req, 'create', 'DialysisPlan', (resolve, reject) => {
    const hospital = req.headers["x-hospital"];
    const info = req.body;
    const plan = new DialysisPlan(info);
    plan.hospital = hospital;
    if (!plan.doctor) {
      const {user} = req.session;
      plan.doctor = user.doctor;
    }
    plan.save((error) => {
      if (error) {
        console.log(error);
        reject({msg: '保存失败!'});
      } else {
        resolve({
          code: config.code.success,
          data: plan
        });
      }
    });
  });
}
