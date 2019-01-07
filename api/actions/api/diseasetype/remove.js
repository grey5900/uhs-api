/*
 * Copyright(c) omk 2016
 * Filename: remove.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const DiseaseType = mongoose.model('DiseaseType');

export default function remove(req) {

  return rap(req, 'delete', 'DiseaseType', (resolve, reject) => {

    const id = req.body.id;
    if (id) {
      DiseaseType.findOneAndUpdate({_id: id}, {deleted: true}, (err) => {
        if (err) {
          reject({msg: '删除失败！'});
        } else {
          resolve({
            code: config.code.success
          });
        }
      });
    }
  });
}
