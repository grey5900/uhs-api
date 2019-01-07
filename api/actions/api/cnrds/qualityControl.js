/*
 * Copyright(c) omk 2016
 * Filename: qualityControl.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期三,  7 九月 2016.
 */
import {sequencePromises} from '../../lib/util';
import saveTxcfx from './qualityControl/saveTxcfx';
import saveDryWeight from './qualityControl/saveDryWeight';
import saveEpo from './qualityControl/saveEpo';
import saveIron from './qualityControl/saveIron';
import saveAcid from './qualityControl/saveAcid';
import saveCalcitriol from './qualityControl/saveCalcitriol';

export default function saveQC(chid, cookie, patientID, primaryDisease, path) {
  return new Promise((resolve, reject) => {
    const promise1 = saveTxcfx(chid, cookie, patientID, primaryDisease, path);
    const promise2 = saveDryWeight(chid, cookie, patientID, primaryDisease, path);
    const promise4 = saveEpo(chid, cookie, patientID, primaryDisease, path);
    const promise5 = saveIron(chid, cookie, patientID, primaryDisease, path);
    const promise6 = saveAcid(chid, cookie, patientID, primaryDisease, path);
    const promise7 = saveCalcitriol(chid, cookie, patientID, primaryDisease, path);
    sequencePromises([promise1, promise2, promise4, promise5, promise6, promise7]).then(resolve, reject);
  });
}
