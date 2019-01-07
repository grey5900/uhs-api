/*
 * Copyright(c) omk 2016
 * Filename: create.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const DiseaseType = mongoose.model('DiseaseType');

export default function create(req) {

  return rap(req, 'create', 'DiseaseType', (resolve, reject) => {
    const info = {
      ...req.body,
      deleted: false
    };
    const diseaseType = new DiseaseType(info);
    diseaseType.save((error) => {
      if (error) {
        console.log(error.message);
        reject({msg: '添加失败！'});
      } else {
        resolve({
          code: config.code.success,
          data: diseaseType
        });
      }
    });
  });
}
