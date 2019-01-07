/**
 * Created by isaac on 16/7/5.
 */

import {listGenerator} from '../../lib/util';

export default function (req) {
  return listGenerator(req, 'FollowupRecord', ['doctor'], {
    populate: 'creator next_appointment patient',
    sort: {date: -1}
  });
}
