/**
 * Created by isaac on 16/9/8.
 */
/*
 * Copyright(c) omk 2016
 * Filename: saveAcid.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期三,  7 九月 2016.
 */

import superagent from 'superagent';
import cheerio from 'cheerio';
import '../../../models/CnrdsQC';
import {kHost, kUserAgent} from '../../../config';

export default function savePath(cookie, chid) {
  return new Promise((resolve, reject) => {
    const request = superagent.get(kHost + 'carehistory.do?action=showmultilist&rid=' + chid + '&sdoctableid=xgtl&modifyflag=window.parent.global_modified&param=zh,0');
    request.set('Cookie', cookie);
    request.set('user-agent', kUserAgent);
    request.end((error, response) => {
      if (error) {
        console.log(error);
        reject({msg: 'get jlyw error'});
      } else {
        const data = response.text;
        const $ = cheerio.load(data);
        const trs = $('tr');
        const length = trs.length;
        if (length > 1) {
          for (let idx = length - 1 ; idx > 0; idx--) {
            const row = trs[idx];
            const rowObjects = $(row).children();
            if (rowObjects.length > 2) {
              const position = $(rowObjects[4]).text().trim();
              const body = $(rowObjects[7]).text().trim();
              const type = $(rowObjects[3]).text().trim();
              const result = `${position}${body}, ${type}`;
              resolve(result);
              break;
            }
          }
        } else {
          resolve();
        }
      }
    });
  });
}
