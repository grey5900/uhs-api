/**
 * Created by isaac on 16/4/27.
 */

import {listGenerator} from '../../lib/util';

export default function(req) {

  const {q} = req.query;
  const hospital = req.headers["x-hospital"];
  const exp = new RegExp(q, 'i');
  const args = {
    $and: [
      {deleted: false},
      {hospital},
      {name: exp}
    ]
  };
  return listGenerator(req, 'DialysisSupply', [args]);
}
