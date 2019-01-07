/**
 * Created by isaac on 16/6/22.
 */

import {listGenerator, getUID} from '../../../lib/util';

export default function(req) {
  const creator = getUID(req);
  return listGenerator(req, 'KidneyDiagnosis', ['patient', {creator}], {sort: {diagnosis_time: -1}});
}
