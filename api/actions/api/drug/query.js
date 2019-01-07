/*
 * Copyright(c) omk 2016
 * Filename: query.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期日, 10 七月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';

import url from 'url';
const Drug = mongoose.model('Drug');
import {kPopulateString} from './one';

export default function (req) {

  return roleAuthPromise(req, 'read', 'Drug', (resolve, reject) => {
    const parsedURL = url.parse(req.url, true);
    const {q} = parsedURL.query;
    const exp = new RegExp(q, 'i');
    console.log('query', q);

    Drug.find({name: exp})
        .populate(kPopulateString)
        .exec((err, docs) => {
          if (err) {
            console.log(err);
            reject({msg: '查找失败！'});
          } else {
            console.log('response', docs);
            resolve({
              code: config.code.success,
              data: docs
            });
          }
        });
  });
}
