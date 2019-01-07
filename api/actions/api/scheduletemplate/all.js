/**
 * Created by isaac on 16/4/30.
 */
import mongoose from 'mongoose';
import config from '../../config';
const PatientScheduleTemplate = mongoose.model('PatientScheduleTemplate');

export default function all(req) {

  return new Promise((resolve, reject) => {
    const {type} = req.query;
    console.log(req.query);
    const hospital = req.headers['x-hospital'];
    if (type === 'patient') {
      PatientScheduleTemplate.find({deleted: false, hospital})
        .deepPopulate('odd_items.patient odd_items.machine even_items.patient even_items.machine')
        .populate('creator odd_items even_items')
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
    } else {
      //TODO
    }
  });
}
