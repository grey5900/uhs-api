/**
 * Created by isaac on 16/5/25.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const DoctorSchedule = mongoose.model('DoctorSchedule');
const PatientSchedule = mongoose.model('PatientSchedule');

export default function remove(req) {

    const {type, id} = req.body;

    if (type === 'patient') {
      return roleAuthPromise(req, 'delete', 'PatientSchedule', (resolve, reject) => {
        PatientSchedule.remove({_id: id}, (err) => {
          if (err) {
            console.log(err);
            reject({msg: '删除失败！'});
          } else {
            resolve({code: config.code.success});
          }
        });
      });
    } else {
      return roleAuthPromise(req, 'delete', 'DoctorSchedule', (resolve, reject) => {
        DoctorSchedule.remove({_id: id}, (err) => {
          if (err) {
            console.log(err);
            reject({msg: '删除失败！'});
          } else {
            resolve({code: config.code.success});
          }
        });
      });
    }
}
