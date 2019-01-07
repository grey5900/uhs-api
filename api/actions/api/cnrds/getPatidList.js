/*
 * Copyright(c) omk 2016
 * Filename: getPatidList.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期四, 18 八月 2016.
 */
import cheerio from 'cheerio';
import superagent from 'superagent';
import {kHost, kUserAgent} from '../../config';

function getOnePageList(text, num) {
  const $ = cheerio.load(text);
  const refs = $('a');
  const result = [];
  for (var i = 6; i <= (2 + num * 4); i = i + 4) {
    const ref = refs[i];
    console.log(17, ref, i, num);
    /* /hd/carehistory.do?action=chSnapshot&patid=989014110&chid=989046859 */
    if (ref && ref.attribs) {
      const link = ref.attribs.onclick;
      const ids = link.match(/.*patid=(\d+).*chid=(\d+).*/);
      result.push({patid: ids[1], chid: ids[2]});
    }
  }
  return result;
}

function getNums(text) {
  const $ = cheerio.load(text);
  const spans = $('span');
  const msg = spans[0].children[2].data;
  const info = msg.split('/');
  const pageNum = info[1].replace(/[^0-9]/g, '');
  const pageSize = info[2].replace(/[^0-9]/g, '');
  const recordNum = info[3].replace(/[^0-9]/g, '');
  return {pageNum, pageSize, recordNum};
}

function getPageContent(pageIndex, cookie, pageSize, recordNum) {
  return new Promise((resolve, reject) => {
    const request = superagent.get(kHost + 'search.do?action=listpat&patStatus=1&scope=mypat&currentpage=' + pageIndex);
    request.set('Cookie', cookie);
    request.set('user-agent', kUserAgent);
    request.end((error, response) => {
      if (error) {
        reject({msg: 'getpage fail'});
      } else {
        const {text} = response;
        if (pageIndex * pageSize > recordNum) {
          resolve(getOnePageList(text, recordNum % pageSize));
        } else {
          resolve(getOnePageList(text, pageSize));
        }
      }
    });
  });
}
export default function getPatidList(cookie) {
  return new Promise((resolve, reject) => {
    const request = superagent.get(kHost + 'search.do?action=listpat&patStatus=1&scope=mypat');
    request.set('Cookie', cookie);
    request.set('user-agent', kUserAgent);
    request.end((error, response) => {
      if (error) {
        console.log('fail');
        reject({msg: 'fail'});
      } else {
        console.log('get first page success');
        const {text} = response;
        const {pageNum, pageSize, recordNum} = getNums(text);
        console.log('get nums', pageNum, pageSize, recordNum);
        let result = [];
        if (recordNum <= pageSize) {
          result = getOnePageList(text, recordNum);
          console.log('get result success1', result);
          resolve(result);
        } else {
          result = getOnePageList(text, pageSize);
          const promises = [];
          for (var i = 2; i <= pageNum; i++) {
            promises.push(getPageContent(i, cookie, pageSize, recordNum));
          }
          Promise.all(promises).then((response) => {
            console.log('response', response);
            response.forEach((item) => {
              result = result.concat(item);
            });
            console.log('get result success2', result);
            resolve(result);
          });
        }
      }
    });
  });
}
