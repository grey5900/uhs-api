/**
 * Created by isaac on 16/2/28.
 */

import {listGenerator} from '../../lib/util';

export default function list(req) {
  return listGenerator(req, 'DialysisMachine', null, {populate: 'infectious_disease brand_reference', sort: {index: 1}});
}
