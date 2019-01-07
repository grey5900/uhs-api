/*
 * Copyright(c) omk 2016
 * Filename: sync.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期一, 22 八月 2016.
 */
import getPatidList from './getPatidList';
import savePatient from './savePatient';
import savePathologicDiagnosis from './diagnosisInfo/diseaseDiagnosis';
import saveAllergyDiagnosis from './diagnosisInfo/guominlist';
import saveSheetList from './examine/index';
import saveQC from './qualityControl';
import savePrimary from './qualityControl/savePrimary';
import savePath from './qualityControl/savePath';
import {sequencePromises} from '../../lib/util';
import {code} from '../../config';

export default function sync(req, params, ctx) {
  const {redisClient} = ctx;
  return new Promise((resolve, reject) => {
    const {user} = req.session;
    const id = `cnrds.${user._id}.key`;
    redisClient.get(id, (error, reply) => {
      if (reply) {
        const cookie = JSON.parse(reply);
        getPatidList(cookie).then((patidObjs) => {
          console.log('get patidObjs', patidObjs);
          const promises = patidObjs.map((idObj) => {
            return new Promise((resolve, reject) => {
              const {patid, chid} = idObj;
              savePatient(cookie, user, patid).then((patientID) => {
                savePrimary(cookie, chid).then((primaryDisease) => {
                  console.log(29, patientID, primaryDisease);
                  savePath(cookie, chid).then((path) => {
                    const p1 = saveSheetList(chid, cookie, patientID, primaryDisease, path);
                    const p2 = savePathologicDiagnosis(chid, cookie, patientID);
                    const p3 = saveAllergyDiagnosis(chid, cookie, patientID);
                    const p4 = saveQC(chid, cookie, patientID, primaryDisease, path);
                    sequencePromises([p1, p2, p3, p4]).then(resolve, reject);
                  });
                });
              });
            });
          });
          Promise.all(promises).then(() => {
            resolve({
              code: code.success,
              data: '数据同步成功'
            });
          });
        });
      } else {
        reject({msg: '请先登录cnrds'});
      }
    });
  });
}
