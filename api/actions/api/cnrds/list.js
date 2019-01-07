/**
 * Created by isaac on 16/9/7.
 */
import {listGenerator} from '../../lib/util';

export default function(req) {
  return listGenerator(req, 'CnrdsQC', ['patient'], {sort: {year: 1, quarter: 1}});
}
