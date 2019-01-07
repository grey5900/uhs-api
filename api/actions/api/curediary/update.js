import mongoose from 'mongoose';
import config from '../../config';
const CureDiary = mongoose.model('CureDiary');
import createCureDiary from './create';
import {roleAuthPromise as rap} from '../../lib/auth';

export default function(req) {

  return rap(req, 'update', 'CureDiary', (resolve, reject) => {
    const {patient, args} = req.body;
    createCureDiary(patient, (diary) => {
      Object.keys(args).forEach((key) => {
        diary[key] = args[key];
      });
    });
    resolve({code: config.code.success});
  });
}
