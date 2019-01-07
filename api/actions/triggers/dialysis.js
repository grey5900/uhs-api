/**
 * Created by Grey on 16/7/15.
 */
import {getCurrentQueue} from '../../kue';
import {kJobDialysisSample} from '../../kue/constants';
import {addMessage} from '../api/message/observers/func';
import mongoose from 'mongoose';
const Message = mongoose.model('Message');
const DialysisItem = mongoose.model('DialysisItem');
const Patient = mongoose.model('Patient');

export default function () {
  return new Promise((resolve, reject) => {
    getCurrentQueue((queue) => {
      queue.process(kJobDialysisSample, (job, done) => {
        const {dialysisItem, longItemOrder} = job.data;
        const {patient, schedule, creator} = dialysisItem;
        const context = '';
        if (dialysisItem) {
          addMessage({
            title: `给${patient.real_name}填写观察记录。`,
            url: `/dialysis`,
            level: 2,
            patient: patient._id,
            receiver: creator,
            origin: dialysisItem._id
          }, context);
        }
        if (longItemOrder.noHeparin) {
          addMessage({
            title: `到时间给${patient.real_name}查房。`,
            url: `/dialysispreview/${dialysisItem._id}`,
            level: 2,
            patient: patient._id,
            receiver: creator,
            origin: dialysisItem._id
          }, context);
        }
        done();
      });
    });
    resolve();
  });
}
