/**
 * Created by yang on 16/7/16.
 */

import {getCurrentQueue} from '../../kue';
import {kJobMachineDisinfect} from '../../kue/constants';
import {kJobMachinePreflush} from '../../kue/constants';
import {addMessage} from '../api/message/observers/func';
import mongoose from 'mongoose';
const Message = mongoose.model('Message');
const DialysisMachine = mongoose.model('DialysisMachine');

export default function () {
  console.log('load machine!');
  getCurrentQueue((queue) => {
    queue.process(kJobMachineDisinfect, (job, done) => {
      const {machine, creator} = job.data;
      DialysisMachine.findOne({_id: machine})
        .exec((error, doc) => {
          console.log(error, doc);
          if (error) {
            console.log(error);
          } else {
            if (doc.disinfect === 2) {
              // disinfect was terminated by someone(admin)
              // create warning for disinfect
              addMessage({
                title: `${doc.index}号机器消毒不充分!`,
                url: `/machine/${machine}`,
                level: 2,
                receiver: creator,
                origin: machine
              }, {});
            } else {
              // change disinfect state to `done`(2)
              doc.disinfect = 2;
              doc.save();
              // create message to notify creator
              addMessage({
                title: `${doc.index}号机器消毒完成!`,
                url: `/machine/${machine}`,
                level: 3,
                receiver: creator,
                origin: machine
              }, {});
            }
          }
        });
      done();
    });


    queue.process(kJobMachinePreflush, (job, done) => {
      const {machine, creator} = job.data;
      DialysisMachine.findOne({_id: machine})
        .exec((error, doc) => {
          console.log(error, doc);
          if (error) {
            console.log(error);
          } else {
            if (doc.preflush === 2) {
              // preflush was terminated by someone(admin)
              // create warning for disinfect
              addMessage({
                title: `${doc.index}机器预冲不充分!`,
                url: `/machine/${machine}`,
                level: 2,
                receiver: creator,
                origin: machine
              }, {});
            } else {
              // change disinfect state to `done`(2)
              doc.preflush = 2;
              doc.save();
              // create message to notify creator
              addMessage({
                title: `${doc.index}机器预冲完成!`,
                url: `/machine/${machine}`,
                level: 3,
                receiver: creator,
                origin: machine
              }, {});
            }
          }
        });
      done();
    });
  });
}
