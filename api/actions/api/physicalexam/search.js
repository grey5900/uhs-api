/**
 * Created by chris on 16/3/29.
 */
import url from 'url';
import generateDateDuration from '../../utils/searchDate';

import {listGenerator} from '../../lib/util';
// import {roleAuthPromise as rap} from '../../lib/auth';

export default function search(req) {
  const obj = url.parse(req.url, true);
  const {search, patient} = obj.query;
  const dateDuration = generateDateDuration(search);
  const {date, nextDate} = dateDuration;
  const args = {
    $and: [
      {deleted: false},
      {patient: patient},
      {exam_time: {$gte: date, $lt: nextDate}}
    ]
  };
  return listGenerator(req, 'PhysicalExam', [args], {sort: {exam_time: -1}});
}
