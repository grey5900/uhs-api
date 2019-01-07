/**
 * Created by isaac on 16/7/9.
 */

import url from 'url';

import generateDateDuration from '../../utils/searchDate';
import {listGenerator} from '../../lib/util';

export default function (req) {
  const obj = url.parse(req.url, true);
  const {search, patient} = obj.query;
  const args = {
    $and: [
      {deleted: false},
      {patient},
    ]
  };
  if (search) {
    const dateDuration = generateDateDuration(search);
    const {date, nextDate} = dateDuration;
    args.$and.push({create_time: {$gte: date, $lt: nextDate}});
  }
  return listGenerator(req, 'DialysisItem', [args], {
      deepPopulate: 'creator creator.doctor schedule schedule.machine schedule.machine.brand_reference',
      sort: {create_time: -1}
    });
}
