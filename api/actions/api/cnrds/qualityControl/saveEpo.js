/*
 * Copyright(c) omk 2016
 * Filename: saveEpo.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期三,  7 九月 2016.
 */

import superagent from 'superagent';
import cheerio from 'cheerio';
import '../../../models/CnrdsQC';
import {kHost, kUserAgent} from '../../../config';
import {sequencePromises} from '../../../lib/util';
import upsertQC from '../upsertQC';

const upsertEpo = ($, rowObjects, patientID, primaryDisease, path) => {
  const obj = {
    epo: {
      interval: $(rowObjects[12]).text().trim() + '/' + $(rowObjects[13]).text().trim(),
      dosage: $(rowObjects[10]).text().trim(),
      start_time: $(rowObjects[3]).text().trim(),
    },
    patient: patientID,
    primary_disease: primaryDisease,
    path
  };
  return upsertQC(obj.epo.start_time, obj);
};

export default function saveEpo(chid, cookie, patientID, primaryDisease, path) {
  return new Promise((resolve, reject) => {
    const request = superagent.get(kHost + 'carehistory.do?action=showmultilist&rid=' + chid + '&sdoctableid=chs&modifyflag=window.parent.global_modified&param=zl,0');
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
          if (rowObjects.length > 2 && $(rowObjects[2]).text().trim() === '是') {
            promises.push(upsertEpo($, rowObjects, patientID, primaryDisease, path));
          }
        }
        sequencePromises(promises).then(resolve, reject);
      }
    });
  });
}
