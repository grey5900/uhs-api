/*
 * Copyright(c) omk 2016
 * Filename: remove.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const DiseaseRecord = mongoose.model('DiseaseRecord');

export default function remove(req) {

  return rap(req, 'delete', 'DiseaseRecord', (resolve, reject) => {
    const {id} = req.body;
    if (id) {
      DiseaseRecord.findOneAndUpdate({_id: id}, {deleted: true}, (error) => {
        if (error) {
          console.log(error.message);
          reject({msg: name + '添加失败！'});
        } else {
          resolve({code: config.code.success});
        }
      });
    } else {
      reject({msg: '缺少参数！'});
    }
  });
}
