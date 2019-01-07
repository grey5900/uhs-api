/**
 * Created by isaac on 2016/4/1.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {addAdminID} from '../../lib/util';
import moment from 'moment';
import {roleAuthPromise as rap} from '../../lib/auth';
const DialysisItem = mongoose.model('DialysisItem');

export default function(req) {
  return rap(req, 'read', 'DialysisItem', (resolve, reject) => {

    let {startDay, endDay} = req.query;
    startDay = moment(startDay).toDate().setHours(0, 0, 0);
    endDay = moment(endDay).toDate().setHours(0, 0, 0);
    const args = {};
    // addAdminID(req, args);
    DialysisItem.find({
        $and: [
          {deleted: false},
          {create_time: {$gte: startDay, $lt: endDay}},
          args
        ]
      })
      .deepPopulate('patient temp_order long_term_order schedule schedule.machine schedule.machine.brand_reference')
      .exec((error, docs) => {
        if (error) {
          console.log(error);
          reject({msg: error.message});
        } else {
          resolve({
            code: config.code.success,
            data: docs
          });
        }
      })
  });
}
