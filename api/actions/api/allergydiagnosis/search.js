/**
 * Created by Grey on 16/7/3.
 */

import moment from 'moment';
import {listGenerator} from '../../lib/util';

export default function search(req) {
  const {search, patient} = req.query;
  const startDay = new Date(search);
  startDay.setHours(0, 0, 0, 0);
  const endDay = moment(startDay).add(1, 'days').toDate();
  const args = {patient, diagnosis_time: {$gte: startDay, $lt: endDay}};

  return listGenerator(req, 'AllergyDiagnosis', [args]);
}
