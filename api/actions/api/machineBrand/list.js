/**
 * Created by isaac on 16/6/29.
 */

import {listGenerator} from '../../lib/util';

export default function list(req) {
  return listGenerator(req, 'MachineBrand');
}
