/*
 * Copyright(c) omk 2016
 * Filename: all.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
import url from 'url';
import {kPopulateString} from './one';
const Drug = mongoose.model('Drug');

export default function (req) {

  return roleAuthPromise(req, 'read', 'Drug', (resolve, reject) => {
    const parsedURL = url.parse(req.url, true);
    const {type} = parsedURL.query;
    const args = {};
    if (type) {
      args.type = type;
    }
    Drug.find(args)
      .populate(kPopulateString)
      .exec((err, docs) => {
      if (err) {
        console.log(err);
        reject({msg: '查找失败！'});
      } else {
        resolve({
          code: config.code.success,
          data: docs
        });
      }
    });
  });
}

