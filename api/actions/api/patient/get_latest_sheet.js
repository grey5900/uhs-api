import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';
const Sheet = mongoose.model('Sheet');
const SheetType = mongoose.model('SheetType');

export default function get_latest_sheet(req) {

  return roleAuthPromise(req, 'read', 'Patient', (resolve, reject) => {

    const {sheetName, patientID, date} = req.query;

    if (sheetName && patientID) {
      SheetType.findOne({name: sheetName}, (err, typeDoc) => {
        if (err || !typeDoc) {reject({msg: '化验单类别查找失败'});}
        else {
          Sheet.find({patient: patientID, type: typeDoc._id, report_time: {$lt: date} })
            .deepPopulate('type results results.reference')
            .sort({'report_time': -1})
            .exec((error, sheetDoc) => {
              if (error) {reject({msg: '最新化验单查找失败'});}
              else if (!typeDoc) { reject({msg: '该患者不存在此类化验单'}); }
              else {
                resolve({
                  code: config.code.success,
                  data: sheetDoc[0] || {}
                });
              }
            });
        }
      })
    } else {
      reject({msg: '缺少参数'});
    }
  });
}
