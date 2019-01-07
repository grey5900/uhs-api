/**
 * Created by yons on 16/3/12.
 */
import mongoose from 'mongoose';
import config from '../../config';
const PhysicalExam = mongoose.model('PhysicalExam');
const CureDiary = mongoose.model('CureDiary');
import {roleAuthPromise as rap} from '../../lib/auth';
import createCureDiary from '../curediary/create';

export default function create(req) {
  return rap (req, 'create', 'PhysicalExam', (resolve, reject) => {
    const info = {
      ...req.body,
      deleted: false
    };
    const exam = new PhysicalExam(info);
    exam.save((err, doc) => {
      if (err) {
        reject({msg: '创建失败！'});
      } else {
        createCureDiary(info.patient, (diary) => {
          diary.events.push({
            target_id: exam,
            model: 'PhysicalExam',
            content: `<a href="/patient/${info.patient}/4">[体格检查]</a>`
          });
        });
        resolve({
          code: config.code.success,
          data: doc
        });
      }
    });
  });
}
