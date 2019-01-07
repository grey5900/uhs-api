/**
 * Created by isaac on 12/2/15.
 */

export default function init(baseURL) {

  const saver = require('./util');

  const bio1 = require('./types/bio1');
  const blood = require('./types/blood');
  const bt = require('./types/bt');
  const coa = require('./types/coa');
  const fe = require('./types/fe');
  const hiv = require('./types/hiv');
  const para = require('./types/para');

  saver(bio1, baseURL);
  saver(blood, baseURL);
  saver(bt, baseURL);
  saver(coa, baseURL);
  saver(fe, baseURL);
  saver(hiv, baseURL);
  saver(para, baseURL);
}
