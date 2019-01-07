/**
 * Created by isaac on 16/8/25.
 */
import mongoose from 'mongoose';
const DialysisPlan = mongoose.model('DialysisPlan');
const Patient = mongoose.model('Patient');
const Doctor = mongoose.model('Doctor');
const DialysisSupply = mongoose.model('DialysisSupply');
const SheetType = mongoose.model('SheetType');
const Drug = mongoose.model('Drug');

const kThreeMonth = 3 * 30 * 24 * 60 * 60 * 1000;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomObject(array) {
  const index = getRandomInt(0, array.length);
  return array[index];
}

function generatePlan(patient) {
  const promises = [];
  const plan = {};
  promises.push(new Promise((resolve, reject) => {
    Drug.find({})
      .limit(6)
      .exec((error, drugs) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          plan.drugs = drugs;
          resolve();
        }
      });
  }));

  promises.push(new Promise((resolve, reject) => {
    DialysisSupply.find({})
      .limit(4)
      .exec((error, supplies) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          plan.supplies = supplies;
          resolve();
        }
      });
  }));

  promises.push(new Promise((resolve, reject) => {
    SheetType.find({})
      .limit(4)
      .exec((error, types) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          plan.laboratories = types;
          resolve();
        }
      });
  }));

  Promise.all(promises).then(() => {
    const {supplies, drugs, laboratories} = plan;
    const newPlan = new DialysisPlan();

    newPlan.patient = patient;
    newPlan.doctor = '570242556480aa996f6dd63c';
    newPlan.path_type = 'AVG';
    newPlan.paths = ['左'];
    newPlan.start_time = new Date().getTime();
    newPlan.end_time = newPlan.start_time + kThreeMonth;
    newPlan.month_dialysis = 13;
    newPlan.week_dialysis = 3;
    newPlan.week_filter = 2;
    newPlan.week_perfusion = 1;

    newPlan.dialyzer = supplies[0];
    newPlan.needle = supplies[1];
    newPlan.perfusion = supplies[2];
    newPlan.diagnosis = '血液透析治疗';
    const diseases = ['糖尿病', '高血压'];
    newPlan.diseases = diseases;
    drugs.forEach(looper => newPlan.items.push({drug: looper, disease: randomObject(diseases), amount: getRandomInt(0, 100), cycle: getRandomInt(3, 30)}));
    supplies.forEach(looper => newPlan.items.push({supply: looper, disease: randomObject(diseases), amount: getRandomInt(0, 100), cycle: getRandomInt(3, 30)}));
    laboratories.map(looper => newPlan.items.push({sheettype: looper, disease: randomObject(diseases), amount: getRandomInt(0, 100), cycle: getRandomInt(3, 30)}));
    newPlan.save(error => console.log(61, error));
  });
}

// generate DialysisPlan for first 50 patients
export default function () {
  Patient.find({})
    .limit(50)
    .exec((error, patients) => {
      if (error) {
        console.log(error);
      } else {
        patients.forEach(generatePlan);
      }
    });
}
