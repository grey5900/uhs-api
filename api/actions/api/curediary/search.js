/**
 * Created by isaac on 16/7/8.
 */
import mongoose from 'mongoose';
import config from '../../config';
import generateDateDuration from '../../utils/searchDate';
const CureDiary = mongoose.model('CureDiary');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function(req) {

  return rap(req, 'read', 'CureDiary', (resolve, reject) => {
    const {patient, search} = req.query;
    const {date, nextDate} = generateDateDuration(search);
    const args = {create_time: {$gte: date.getTime(), $lt: nextDate.getTime()}, patient};
    CureDiary.find(args)
      .deepPopulate('patient doctor events.target_id')
      .sort({create_time: -1})
      .exec((err, docs) => {
        if (err) {
          console.log(err);
          reject({msg: '查找失败！'});
        } else {
          resolve({
            code: config.code.success,
            data: docs
          });
        }
      });
  });
}
