/**
 * Created by isaac on 16/9/8.
 */
import superagent from 'superagent';
import cheerio from 'cheerio';
import {kHost, kUserAgent} from '../../../config';
import fs from 'fs';
import path from 'path';

function parseDOM(data, resolve) {
  const $ = cheerio.load(data);
  // TODO
  const lables = $('label');
  if (lables && lables.length > 0) {
    const strings = [];
    for (let idx = 0; idx < lables.length; ++idx) {
      const looper = lables[idx];
      const children = $(looper).children();
      const input = children[0];
      if (input && typeof input.attribs.checked !== 'undefined') {
        strings.push(input.next.data);
      }
    }
    const str = strings.join(', ');
    console.log(25, str);
    resolve(str);
  } else {
    console.log(28, 'no primary disease');
    resolve();
  }
}

// http://hd.cnrds.net/hd/carehistory.do?action=showform&chid=354287946&tableid=yfbzd&readonly=true
export default function (cookie, chid) {
  return new Promise((resolve, reject) => {
    const url = kHost + `carehistory.do?action=showform&chid=${chid}&tableid=yfbzd&readonly=true`;
    const request = superagent.get(url);
    request.set('Cookie', cookie);
    request.set('user-agent', kUserAgent);
    request.end((error, response) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log(response.text);
        parseDOM(response.text, resolve);
      }
    });
  });
}

export function readFile() {
  fs.readFile(path.join(__dirname, './primary.html'), (error, data) => {
    if (error) {
      console.log(error);
    } else {
      parseDOM(data, (strings) => {
        console.log(51, strings);
      });
    }
  });
}
