/**
 * Created by yons on 16/3/12.
 */
import {listGenerator} from '../../lib/util';

export default function all(req) {
  return listGenerator(req, 'PhysicalExam', ['patient', {deleted: false}], {sort: {exam_time: -1}});
}
