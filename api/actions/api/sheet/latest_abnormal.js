/**
 * Created by chris2 on 16-7-4.
 */

import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const Sheet = mongoose.model('Sheet');
const SheetType = mongoose.model('SheetType');
const SheetReference = mongoose.model('SheetReference');
const SheetResult = mongoose.model('SheetResult');
const {ObjectId} = mongoose.Types;
export default function latest_abnormal(req) {

  return rap(req, 'read', 'SheetType', (resolve, reject) => {
    const {sheetNames, patientID, date} = req.query;
    console.log('req.query', sheetNames);
    if (sheetNames && patientID) {
      SheetType.find({name: {$in: sheetNames}}, (err, typeDocs) => {
        if (err) {reject({msg: '化验单类别查找失败'});}
        else {
          var docIDs = typeDocs.map((doc) => {return doc._id});
          Sheet.aggregate([
            {$match: {$and: [{type: {$in: docIDs}}, {patient: new ObjectId(patientID)}, {report_time: {$lt: new Date(date)}}]}},
            {$sort: {report_time: -1}},
            {$group: {_id: '$type', report_time: {$first: '$report_time'}, type: {$first: '$type'}, results: {$first: '$results'}}}
          ]).exec((error, results) => {
            if (error) {
              reject({msg: '最新化验单查找失败'});
            } else {
              console.log('sheetDoc', results);
              SheetType.populate(results, {path: '_id'}, (typeErr, typeResults) => {
                if(typeErr) {
                  reject({msg: 'populate sheet type err'});
                } else {
                  SheetResult.populate(typeResults, {'path': 'results'}, (resultErr, resultDocs) => {
                    if(resultErr) {
                      reject({msg: 'populate Results err'})
                    } else {
                      const abnormalResults = [];
                      resultDocs.forEach((resultDoc) => {
                        var typeName = resultDoc._id.name;
                        resultDoc.results.forEach((result) => {
                          if (result.abnormal) {
                            result._doc.typeName = typeName // 这里需要注意, 直接改result没有用, 需要向里面的_doc写
                            abnormalResults.push(result);
                          }
                        })
                      });
                      SheetReference.populate(abnormalResults, {path: 'reference'}, (referenceErr, referenceResults) => {
                        if (referenceErr) {
                          reject({msg: 'populate reference err'});
                        } else {
                          resolve({
                            code: config.code.success,
                            data: referenceResults
                          });
                        }
                      })
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      reject({msg: '缺少参数'});
    }
  });
}
