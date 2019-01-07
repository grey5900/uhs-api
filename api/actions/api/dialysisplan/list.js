/**
 * Created by isaac on 16/8/24.
 */

import {listGenerator} from '../../lib/util';

export const deepPopulate = 'doctor';

export default function (req) {
  return listGenerator(req, 'DialysisPlan', ['patient'], {populate: 'doctor', sort: {create_time: -1}});
}
