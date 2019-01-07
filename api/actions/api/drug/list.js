/**
 * Created by isaac on 16/5/21.
 */

import {listGenerator} from '../../lib/util';
import {kPopulateString} from './one';

export default function list(req) {

  return listGenerator(req, 'Drug', ['type'], {populate: kPopulateString});
}
