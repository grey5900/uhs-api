/*
 * Copyright(c) omk 2016
 * Filename: create.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
import {getTime} from '../../lib/util';
const DiseaseRecord = mongoose.model('DiseaseRecord');
const Diagnosis = mongoose.model('Diagnosis');

export default function update(req) {

  return rap(req, 'update', 'Diagnosis', (resolve, reject) => {
    const {args} = req.body;
    const result = [];
    let shouldStop = false;
    for (let i = 0; i < args.length; ++i) {
      const info = args[i];
      const {...others, _id, diagnosis} = info;
      const params = {...others};
      if (_id) {
        if (diagnosis) {
          if (diagnosis._id) {
            const id = diagnosis._id;
            Diagnosis.findOneAndUpdate({_id: id}, diagnosis, () => {
            })
          } else {
            const newDiagnosis = new Diagnosis(diagnosis);
            params.diagnosis = newDiagnosis;
            newDiagnosis.save((error) => {
              if (error) {
                console.log('diagnosis :', error);
              }
            });
          }
        }
        params.update_time = getTime();
        DiseaseRecord.findOneAndUpdate({_id: _id}, params, (error) => {
          if (error) {
            shouldStop = true;
            reject({msg: name + '更新失败！'});
          } else {

            result.push(_id);
          }
        });
      } else {
        shouldStop = true;
        reject({msg: '缺少参数！'});
      }

      if (shouldStop) {
        break;
      }
    }

    resolve({
      code: config.code.success,
      data: result
    });

  });
}
