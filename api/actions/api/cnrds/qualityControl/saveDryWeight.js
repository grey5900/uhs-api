/*
 * Copyright(c) omk 2016
 * Filename: saveDryWeight.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期三,  7 九月 2016.
 */

import superagent from 'superagent';
import cheerio from 'cheerio';
import '../../../models/CnrdsQC';
import {kHost, kUserAgent} from '../../../config';
import {sequencePromises} from '../../../lib/util';
import upsertQC from '../upsertQC';
import moment from 'moment';

export default function saveTxcfx(chid, cookie, patientID, primaryDisease, path) {
  return new Promise((resolve, reject) => {
    const request = superagent.get(kHost + 'carehistory.do?action=showmultilist&rid=' + chid + '&sdoctableid=gtz&modifyflag=window.parent.global_modified&param=zh,5');
    request.set('Cookie', cookie);
    request.set('user-agent', kUserAgent);
    request.end((error, response) => {
      if (error) {
        console.log(error);
        reject({msg: 'get gtz error'});
      } else {
        const data = response.text;
        const $ = cheerio.load(data);
        const trs = $('tr');
        const length = trs.length;
        const objs = [];
        for (let idx = 1; idx < length; idx++) {
          const row = trs[idx];
          const rowObjects = $(row).children();
          if (rowObjects.length > 2) {
            const date = $(rowObjects[2]).text().trim();
            const year = moment(date).year();
            const month = moment(date).month() + 1;
            const quarter = moment(date).quarter();
            const monthly = {month, dry_weight: $(rowObjects[4]).text().trim()};
            const index = objs.findIndex((i) => i.year === year && i.quarter === quarter);
            if (index === -1) {
              const obj = {
                date,
                year,
                quarter,
                patient: patientID,
                primary_disease: primaryDisease,
                path,
                monthly: [monthly]
              };
              objs.push(obj);
            } else {
              const idx2 = objs[index].monthly.findIndex((j) => j.month === month);
              if (idx2 === -1) {
                objs[index].monthly.push(monthly);
              } else {
                Object.assign(objs[index].monthly[idx2], monthly);
              }
            }
          }
        }
        const request2 = superagent.get(kHost + 'carehistory.do?action=showmultilist&rid=' + chid + '&sdoctableid=xycl&modifyflag=window.parent.global_modified&param=zh,2');
        request2.set('Cookie', cookie);
        request2.set('user-agent', kUserAgent);
        request2.end((error, response) => {
          if (error) {
            console.log(error);
            reject({msg: 'get xycl error'});
          } else {
            const data = response.text;
            const $ = cheerio.load(data);
            const trs = $('tr');
            const length = trs.length;
            for (let idx = 1; idx < length; idx++) {
              const row = trs[idx];
              const rowObjects = $(row).children();
              if (rowObjects.length > 2) {
                const date = $(rowObjects[2]).text().trim();
                const year = moment(date).year();
                const month = moment(date).month() + 1;
                const quarter = moment(date).quarter();
                const monthly = {
                  month,
                  pre_high: $(rowObjects[4]).text().trim(),
                  pre_low: $(rowObjects[5]).text().trim(),
                  post_high: $(rowObjects[6]).text().trim(),
                  post_low: $(rowObjects[7]).text().trim(),
                };
                const index = objs.findIndex((i) => i.year === year && i.quarter === quarter);
                if (index === -1) {
                  const obj = {
                    date,
                    year,
                    quarter,
                    patient: patientID,
                    primary_disease: primaryDisease,
                    path,
                    monthly: [monthly]
                  };
                  objs.push(obj);
                } else {
                  const idx2 = objs[index].monthly.findIndex((j) => j.month === month);
                  if (idx2 === -1) {
                    objs[index].monthly.push(monthly);
                  } else {
                    Object.assign(objs[index].monthly[idx2], monthly);
                  }
                }
              }
            }
            console.log('----------------objs', objs);
            const promises = objs.map((obj) => upsertQC(obj.date, obj));
            sequencePromises(promises).then(resolve, reject);
          }
        });
      }
    });
  });
}
