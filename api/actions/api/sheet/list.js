/**
 * Created by isaac on 16/7/1.
 */
import {listGenerator} from '../../lib/util';

export default function(req) {
  return listGenerator(req, 'Sheet', ['patient'], {
    deepPopulate: 'record doctor patient type results results.reference',
    sort: {report_time: -1}
  });
}
