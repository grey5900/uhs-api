/**
 * Created by yons on 16/3/30.
 */

import {listGenerator} from '../../lib/util';

export default function list(req) {

  return listGenerator(req, 'Doctor', null, {populate: 'avatar'});
}
