/**
 * Created by isaac on 16/6/28.
 */
import mongoose from 'mongoose';
import moment from 'moment';
import {getTime} from '../../lib/util';
const CureDiary = mongoose.model('CureDiary');

export default function createCureDiary(patient, callback) {
  const now = new Date();
  const startTime = moment(now).startOf('day').toDate().getTime();
  const endTime = moment(now).endOf('day').toDate().getTime();
  CureDiary.findOne({
      patient,
      create_time: {
        $gte: startTime, $lte: endTime
      }
    },
    (error, doc) => {
      if (error) {
        console.log(error);
      } else {
        if (doc) {
          callback(doc);
        } else {
          doc = new CureDiary();
          doc.patient = patient;
          callback(doc);
        }
        doc.update_time = getTime();
        doc.save((error) => {
          if (error) {
            console.log(error);
          }
        });
      }
    });
}
