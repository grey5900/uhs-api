/**
 * Created by isaac on 16/6/22.
 */

import moment from 'moment';
import {listGenerator, getUID} from '../../../lib/util';

export default function search(req) {
  const {search, patient} = req.query;
  const startDay = new Date(search);
  startDay.setHours(0, 0, 0, 0);
  const endDay = moment(startDay).add(1, 'days').toDate();
  const creator = getUID(req);
  const args = {patient, diagnosis_time: {$gte: startDay, $lt: endDay}, creator};

  return listGenerator(req, 'KidneyDiagnosis', [args]);
}
