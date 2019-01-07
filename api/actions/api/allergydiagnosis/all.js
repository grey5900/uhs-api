/**
 * Created by Grey on 16/7/3.
 */
import {listGenerator} from '../../lib/util';

export default function all(req) {
  return listGenerator(req, 'AllergyDiagnosis', ['patient'], {sort: {diagnosis_time: -1}});
}
