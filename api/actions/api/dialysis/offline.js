/**
 * Created by isaac on 16/7/6.
 */
import mongoose from 'mongoose';
import config from '../../config';
import createCureDiary from '../curediary/create';
import {minutesToString, getTime} from '../../lib/util';
import moment from 'moment';
import {roleAuthPromise as rap} from '../../lib/auth';
const DialysisItem = mongoose.model('DialysisItem');
const DialysisMachine = mongoose.model('DialysisMachine');

export default function (req) {
  return rap(req, 'read', 'DialysisItem', (resolve, reject) => {
    const {id, args} = req.body;
    DialysisItem.findOne({_id: id})
      .populate('schedule')
      .exec((error, doc) => {
      if (error) {
        console.log(error);
        reject({msg: error.message});
      } else {
        doc.post_heartrate = args.post_heartrate;
        doc.post_high_bp = args.post_high_bp;
        doc.post_low_bp = args.post_low_bp;
        doc.post_weight = args.post_weight;
        doc.post_water_mass = parseFloat(doc.pre_weight) - parseFloat(args.post_weight);
        doc.status = 4;
        doc.duration += moment().diff(doc.last_start_time, 'minutes');
        doc.update_time = getTime();
        doc.save((error) => {
          if (error) {
            console.log(error);
            reject({msg: error.message});
          } else {
            const dialysis = doc;
            const {patient} = doc;
            createCureDiary(patient, (diary) => {
              diary.events.push({
                target_id: dialysis,
                model: 'DialysisItem',
                content: `<a href="/dialysisdetail/${dialysis.id}">[今日透析]</a>`
                + `透前体重: ${dialysis.pre_weight || ''} kg 透前血压: ${dialysis.pre_high_bp || ''} / ${dialysis.pre_low_bp || ''}`
                + `预设超滤量: ${dialysis.pre_water_mass || ''} ml`
                + `透析时长: ${minutesToString(dialysis.duration) || ''} 透后体重: ${dialysis.post_weight || ''} kg`
                + `透后血压: ${dialysis.post_high_bp || ''} / ${dialysis.post_low_bp || ''}`,
              });
            });
            resolve({code: config.code.success});
          }
        });

        // change machine status
        //
        DialysisMachine.findOneAndUpdate({_id: doc.schedule.machine}, {preflush: 0, disinfect: 0}, (error) => {
          if (error) {
            console.log(error);
          }
        });
      }
    });
  });
}
