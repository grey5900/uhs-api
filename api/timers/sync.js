/**
 * Created by isaac on 16/8/16.
 */

import {CronJob} from 'cron';
import superagent from 'superagent';
import mongoose from 'mongoose';
import config from './config';

const SyncTime = mongoose.model('SyncTime');

const modelList = [
  'Admin',
  'Diagnosis',
  'DiseaseRecord',
  'Hospital',
  'NutritionAssessment',
  'Position',
  'SheetType',
  'AllergyDiagnosis',
  'DiagnosisReference',
  'DiseaseType',
  'KidneyBasic',
  'Order',
  'Prescription',
  'CardInfo',
  'DiagnosisType',
  'Doctor',
  'KidneyDiagnosis',
  'Outcome',
  'Price',
  'TreatPlan',
  'Company',
  'DialysisItem',
  'Drug',
  'MachineBrand',
  'PathologicDiagnosis',
  'Record',
  'UserEvent',
  'Contact',
  'DialysisMachine',
  'DrugType',
  'Medicare',
  'Patient',
  'Sheet',
  'Credit',
  'DialysisSupply',
  'File',
  'Message',
  'Peritoneal',
  'SheetReference',
  'DoctorSchedule',
  'DoctorScheduleItem',
  'PatientSchedule',
  'PatientScheduleItem',
  'PatientScheduleTemplate',
  'CureDiary',
  'Disease',
  'FollowupRecord',
  'Meta',
  'PhysicalExam',
  'SheetResult'
];

let job = null;
export default function () {
  const onTick = () => {
    const now = new Date().getTime();
    modelList.forEach((modelName) => {
      SyncTime.findOne({name: modelName})
        .exec((error, record) => {
          if (error) {
            console.log(error);
          } else {
            if (!record) {
              record = new SyncTime();
              record.update_time = 0;
              record.name = modelName;
            }
            const Model = mongoose.model(modelName);
            const queryArgs = {
              $or: [
                {update_time: {$gt: record.update_time}},
                {update_time: {$eq: null}}
              ]
            };
            Model.find(queryArgs)
              .select('-__v')
              .exec((error, docs) => {
                if (error) {
                  console.log(error);
                } else if (docs.length > 0) {
                  // need to sync docs
                  const request = superagent.post(config.syncURL);
                  request.send({
                    model: modelName,
                    data: docs
                  });
                  request.end((error, {body = {}}) => {
                    if (error) {
                      console.log(error);
                    } else {
                      record.update_time = now;
                      record.save((error) => {
                        if (error) {
                          console.log(error);
                        }
                      });
                    }
                  });
                }
              });
          }
        });
    });
  };

  if (!job) {
    const cronTime = '0 12 * * *';
    job = new CronJob({
      // cronTime: `* * * ${Timing} * * *`,
      cronTime,
      onTick,
      start: false,
      timeZone: 'Asia/Chongqing'
    });
    job.start();
    console.log('start sync cron job!');
  }
}
