/**
 * Created by isaac on 16/6/20.
 */
import {registerProcessor} from './processors';
import {dialysis, dialysisSamples, dialysisSingleSample} from './constants';
import {addMessage, getUID} from './func';
import mongoose from 'mongoose';
const Message = mongoose.model('Message');
const DialysisItem = mongoose.model('DialysisItem');
const Patient = mongoose.model('Patient');

function bloodLevel(high, low) {
  var color = 0;
  if (high >= 160 || low >= 110) {
    color = 4;
  } else if (high >= 140 || low >= 90) {
    color = 3;
  } else if (high < 90 || low < 60) {
    color = 2;
  } else {
    color = 0;
  }
  return color;
}

function createMessage(receiver, patient, dialysisID, msg, ctx) {
  Patient.findOne({_id: patient}, (error, doc) => {
    if (error) {
      console.log(error);
    } else {
      addMessage({
        title: `${doc.real_name}${msg}`,
        url: `/dialysispreview/${dialysisID}`,
        level: 2,
        patient,
        receiver,
        origin: dialysisID
      }, ctx);
    }
  });
}

registerProcessor(dialysis, (request, context) => {
  const userID = getUID(request);
  const {
    id, patient, accident, other_accident,
    pre_high_bp, pre_low_bp, post_high_bp, post_low_bp,
    pre_weight
  } = request.body;
  if (accident || other_accident) {
    createMessage(userID, patient, id, `的透析有不良事件: ${accident || ''}  ${other_accident || ''}`, context);
  }

  // check blood pressure
  //
  if (pre_high_bp && pre_low_bp) {
    var level = bloodLevel(pre_high_bp, pre_low_bp);
    if (level === 4) {
      // high
      createMessage(userID, patient, id, `的透前血压: ${pre_high_bp} / ${pre_low_bp}偏高`, context);
    } else if (level === 2) {
      createMessage(userID, patient, id, `的透前血压: ${pre_high_bp} / ${pre_low_bp}偏低`, context);
    }
  }
  if (post_high_bp && post_low_bp) {
    var level = bloodLevel(post_high_bp, post_low_bp);
    if (level === 4) {
      // high
      createMessage(userID, patient, id, `的透后血压: ${post_high_bp} / ${post_low_bp}偏高`, context);
    } else if (level === 2) {
      createMessage(userID, patient, id, `的透后血压: ${post_high_bp} / ${post_low_bp}偏低`, context);
    }
  }

  //check weight
  if (pre_weight) {
    Patient.findOne({_id: patient})
      .populate('record')
      .exec((error, doc) => {
        if (error) {
          console.log(error);
        } else {
          var record = doc.record;
          var idea_mass = record.idea_mass;
          if (idea_mass && Math.abs(pre_weight - idea_mass) > idea_mass * 0.05) {
            addMessage({
              title: `${doc.real_name}透析前体重超过干体重的5%!`,
              url: `/dialysisdetail/${dialysisID}`,
              level: 2,
              patient,
              receiver: userID,
              origin: id
            }, context);
          }
        }
      });
  }
});

registerProcessor(dialysisSamples, (request, context) => {
  const {id, samples} = request.body;
  const userID = getUID(request);
  // FIXME: bug here: will generate multi message for same dialysis record!!!
  if (samples) {
    DialysisItem.findOne({_id: id})
      .populate('patient')
      .exec((error, doc) => {
        if (doc) {
          const {patient} = doc;
          samples.forEach(({bp_high, bp_low}) => {
            if (bp_high && bp_low) {
              var level = bloodLevel(bp_high, bp_low);
              if (level === 4) {
                createMessage(userID, patient, id, `的观察记录血压: ${bp_high} / ${bp_low}偏高`, context);
              } else if (level === 2) {
                createMessage(userID, patient, id, `的观察记录血压: ${bp_high} / ${bp_low}偏高`, context);
              }
            }
          });
        }
      });
  }
});


registerProcessor(dialysisSingleSample, (request, context) => {
  const {id, samples} = request.body;
  const userID = getUID(request);
  // FIXME: bug here: will generate multi message for same dialysis record!!!
  if (samples) {
    DialysisItem.findOne({_id: id})
      .populate('patient')
      .exec((error, doc) => {
        if (doc) {
          const {patient} = doc;
          const {bp_high, bp_low} = samples;
          if (bp_high && bp_low) {
            var level = bloodLevel(bp_high, bp_low);
            if (level === 4) {
              createMessage(userID, patient, id, `的观察记录血压: ${bp_high} / ${bp_low}偏高`, context);
            } else if (level === 2) {
              createMessage(userID, patient, id, `的观察记录血压: ${bp_high} / ${bp_low}偏高`, context);
            }
          }
        }
      });
  }
});
