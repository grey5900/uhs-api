// index for old data

var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

// Model
const Patient = mongoose.model('Patient');
const PhysicalExam = mongoose.model('PhysicalExam');
const Doctor = mongoose.model('Doctor');
const DialysisSupply = mongoose.model('DialysisSupply');
const KidneyDiagnosis = mongoose.model('KidneyDiagnosis');
const Medicare = mongoose.model('Medicare');
const NutritionAssessment = mongoose.model('NutritionAssessment');
const Order = mongoose.model('Order');
const PathologicDiagnosis = mongoose.model('PathologicDiagnosis');
const Prescription = mongoose.model('Prescription');
const FollowupRecord = mongoose.model('FollowupRecord');


const modelArray = [Patient, FollowupRecord, Doctor, DialysisSupply, KidneyDiagnosis, Medicare,
  Order, Prescription];

export default  function () {

  return new Promise((resolve, reject)=> {

    modelArray.forEach((model)=> {
      var stream = model.synchronize();
      var count = 0;
      stream.on('data', function (err, doc) {
        count++;
      });
      stream.on('close', function () {
        console.log('indexed ' + count + ' documents!');
        resolve({msg: 'indexed' + count + 'documents!'});
      });
      stream.on('error', function (err) {
        console.log(err);
        reject({msg: 'something wrong when indexing old data, check the log!'})
      });
    });
  });
}
