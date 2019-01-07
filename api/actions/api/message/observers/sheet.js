/**
 * Created by isaac on 16/5/21.
 */
import {registerProcessor} from './processors';
import {sheet} from './constants';
import {getUID} from './func';
import mongoose from 'mongoose';
const Message = mongoose.model('Message');
const Patient = mongoose.model('Patient');

registerProcessor(sheet, (request, context) => {
  const {results, patient} = request.body;
  const userID = getUID(request);
  var abnormal = false;
  for (var idx = 0; idx < results.length; ++idx) {
    if (results[idx].abnormal) {
      abnormal = true;
      break;
    }
  }

  if (abnormal) {
    const sheetType = context.type;
    Patient.findOne({_id: patient}, (error, doc) => {
      if (error) {
        console.log(error);
      } else {
        // show generate alert message
        var message = new Message();
        message.title = `${doc.real_name}的化验单:${sheetType.name}异常`;
        message.url = `/patient/${patient}/7`;
        message.level = 3;
        message.patient = patient;
        message.doctor = context.doctor;
        message.origin = context.sheet;
        message.receiver = userID;
        message.has_read = false;
        message.save((error) => {
          if (error) {
            console.log(error);
          }
        });
      }
    });
  }
});