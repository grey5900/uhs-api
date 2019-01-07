/**
 * Created by isaac on 16/1/18.
 */

var mongoose = require('mongoose');
var Patient = mongoose.model('Patient');
var LaborRecord = mongoose.model('LaborRecord');
var UserEvent = mongoose.model('UserEvent');

module.exports = function (laborRecordID) {

    LaborRecord.findOne({_id: laborRecordID},
        function (error, record) {

            if (error) {
                console.log(error, record);
            }else {
                var patientID = record.assignee;

                Patient.findOne({_id: patientID}, function (error, patient) {


                    if (error || !patient) {
                        console.log('Error ' + error);
                    } else {

                        patient.labor_info.count += 1;
                        patient.labor_info.revenue += record.payment;
                        patient.labor_info.score += (record.score.quality + record.score.speed);

                        patient.save(function (error) {
                            if (error) {
                                console.log('Error ' + error.message);
                            } else {

                                var event = new UserEvent();
                                event.type = 'labor_add_score';
                                event.patient = patient.id;
                                event.target_id = laborRecordID;

                                event.save(function (error) {
                                    if (error) {
                                        console.log('Error ' + error.message);
                                    }
                                });
                            }
                        })
                    }
                })
            }
    });
};
