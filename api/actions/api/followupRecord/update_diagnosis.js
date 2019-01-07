/*
 * Copyright(c) omk 2016
 * Filename: update_diagnosis.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : Saturday,  9 April 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {getTime} from '../../lib/util';
import {roleAuthPromise} from '../../lib/auth';
const FollowupRecord = mongoose.model('FollowupRecord');
const Diagnosis = mongoose.model('Diagnosis');

export default function update_diagnosis(req) {

  return roleAuthPromise(req, 'update', 'FollowupRecord', (resolve, reject) => {
      console.log('req', req.body);
      const {id, diagnosis} = req.body;

      //如果随访已经有诊断了就更新这个诊断，没有就创建并把id放到随访里。
      if (diagnosis._id) {
        Diagnosis.findOneAndUpdate({_id: diagnosis._id}, {
          description: diagnosis.description,
          update_time: getTime()
        }, (err, doc) => {
          if (err) {
            reject({msg: '随访更新诊断失败'});
          } else {
            resolve({code: config.code.success});
          }
        });
      } else {
        const newDiagnosis = new Diagnosis();
        newDiagnosis.description = diagnosis.description;
        newDiagnosis.save((error) => {
          if (error) {
            reject({msg: '新建诊断失败'});
          } else {
            FollowupRecord.findOneAndUpdate({_id: id}, {
              first_visit: false,
              diagnosis: newDiagnosis._id,
              update_time: getTime()
            }, (err, doc) => {
              if (err) {
                reject({msg: '随访更新诊断失败'});
              } else {
                resolve({code: config.code.success});
              }
            });
          }
        });
      }
    }
  )
}
