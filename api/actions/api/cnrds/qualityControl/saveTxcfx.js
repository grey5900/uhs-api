/*
 * Copyright(c) omk 2016
 * Filename: saveTxcfx.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期三,  7 九月 2016.
 */
import superagent from 'superagent';
import cheerio from 'cheerio';
import '../../../models/CnrdsQC';
import {kHost, kUserAgent} from '../../../config';
import {sequencePromises} from '../../../lib/util';
import upsertQC from '../upsertQC';

const upsertTxcfx = ($, rowObjects, patientID, primaryDisease, path) => {
  const obj = {
    adequacy_date: $(rowObjects[2]).text().trim(),
    height: $(rowObjects[3]).text().trim(),
    weight: $(rowObjects[4]).text().trim(),
    bmi: $(rowObjects[5]).text().trim(),
    urr: $(rowObjects[11]).text().trim(),
    ktv: $(rowObjects[12]).text().trim(),
    patient: patientID,
    primary_disease: primaryDisease,
    path
  };
  return upsertQC(obj.adequacy_date, obj);
};

export default function saveTxcfx(chid, cookie, patientID, primaryDisease, path) {
  return new Promise((resolve, reject) => {
    const request = superagent.get(kHost + 'carehistory.do?action=showmultilist&rid=' + chid + '&sdoctableid=txcfx&modifyflag=window.parent.global_modified&param=zh,3');
    request.set('Cookie', cookie);
    request.set('user-agent', kUserAgent);
    request.end((error, response) => {
      if (error) {
        console.log(error);
        reject({msg: 'get txcfx error'});
      } else {
        const data = response.text;
        const $ = cheerio.load(data);
        const trs = $('tr');
        const length = trs.length;
        const promises = [];
        for (let idx = 1; idx < length; idx++) {
          const row = trs[idx];
          const rowObjects = $(row).children();
          if (rowObjects.length > 2) {
            promises.push(upsertTxcfx($, rowObjects, patientID, primaryDisease, path));
          }
        }
        sequencePromises(promises).then(resolve, reject);
      }
    });
  });
}
