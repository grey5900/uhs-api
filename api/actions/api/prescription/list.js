/*
 * Copyright(c) omk 2016
 * Filename: list.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期一, 25 七月 2016.
 */

import {listGenerator} from '../../lib/util';

export default function list(req) {

  return listGenerator(req, 'Prescription', ['record'], {deepPopulate: 'prescription_drug prescription_drug.drug doctor', sort: {create_time: -1}});
}
