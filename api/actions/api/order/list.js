/*
 * Copyright(c) omk 2016
 * Filename: list.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期一, 25 七月 2016.
 */

import {listGenerator} from '../../lib/util';
import {deepPopulate} from './all';

export default function list(req) {

  return listGenerator(req, 'Order', ['type', 'record'], {deepPopulate, sort: {create_time: -1}});
}
