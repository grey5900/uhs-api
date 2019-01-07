/**
 * Created by isaac on 16/8/18.
 */
import mongoose from 'mongoose';
import moment from 'moment';

const Patient = mongoose.model('Patient');
const FollowupRecord = mongoose.model('FollowupRecord');
const startDate = new Date(2016, 7, 1);

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

export default function () {
  Patient.find({}).limit(40).exec((error, docs) => {
    if (error) {
      console.log(error);
    } else {
      docs.forEach((patient) => {
        for (let idx = 0; idx < 20; ++idx) {
          let date = moment(startDate).add(idx, 'days').toDate();
          const record = new FollowupRecord();
          record.patient = patient.id;
          record.peritoneal = {
            hemoglobin: getRandomArbitrary(0, 100),
            correct_calcium: getRandomArbitrary(0, 100),
            blood_phosphorus: getRandomArbitrary(0, 100),
            ipth: getRandomArbitrary(0, 100),
            albumin: getRandomArbitrary(0, 100),
            transferin_saturation: getRandomArbitrary(0, 100),
            ferritin: getRandomArbitrary(0, 100)
          };
          record.create_time = date;
          record.save((error) => {
            if (error) {
              console.log(error);
            }
          });
        }
      });
      console.log('done generate dummy data');
    }
  });
}
