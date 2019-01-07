/**
 * Created by isaac on 16/5/25.
 */
import mongoose from 'mongoose';
import config from '../../config';
const PatientScheduleTemplate = mongoose.model('PatientScheduleTemplate');

export default function remove(req) {

  return new Promise((resolve, reject) => {
    const {id} = req.body;
    PatientScheduleTemplate.remove({_id: id}, (err) => {
      if (err) {
        console.log(err);
        reject({msg: '删除失败！'});
      } else {
        resolve({code: config.code.success});
      }
    });
  });
}
