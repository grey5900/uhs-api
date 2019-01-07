/**
 * Created by isaac on 16/6/30.
 */
import {registerProcessor} from './processors';
import {patient} from './constants';
import mongoose from 'mongoose';
import {addMessage, getUID} from './func';
const Patient = mongoose.model('Patient');

registerProcessor(patient, (request, context) => {
  const {patient} = context;
  const userID = getUID(request);
  addMessage({
    title: `${patient.real_name}的基础信息变更了`,
    url: `/patient/${patient._id}`,
    level: 3,
    patient: patient._id,
    origin: patient._id,
    receiver: userID,
    creator: userID
  }, context);
});