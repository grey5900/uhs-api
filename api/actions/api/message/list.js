/**
 * Created by isaac on 16/7/18.
 */

import {listGenerator} from '../../lib/util';

export default function(req) {
  return listGenerator(req, 'Message', ['receiver'], {sort: {create_time: -1}});
}
