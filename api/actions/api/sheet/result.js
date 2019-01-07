/*
 * Copyright(c) omk 2016
 * Filename: result.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六, 27 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const Sheet = mongoose.model('Sheet');
const SheetReference = mongoose.model('SheetReference');

export default function result(req) {

  return rap(req, 'create', 'Sheet', (resolve, reject) => {

    const info = req.body;
    const sheet = info.sheet;

    if (sheet) {
      var newResult = new SheetResult();
      newResult.reference = info.reference;
      newResult.short_name = info.short_name;
      newResult.value = info.value;
      newResult.name = info.name;

      //result.name 与reference.name是相等的,
      // 手动录入时, 根据reference的id来确定result的name
      if (newResult.reference && !newResult.name) {
        SheetReference.findOne({_id: info.reference}, (err, doc) => {
          if (!err && doc) {
            newResult.name = doc.name;
            newResult.save((error) => {
              if (error) {
                reject({msg: '化验结果添加失败'});
              } else {
                Sheet.findOneAndUpdate({_id: sheet},
                  {"$push": {results: newResult._id}},
                  {new: true}, (err, doc) => {
                    if (err) {
                      reject({msg: '化验单添加结果失败'});
                    } else {
                      resolve({
                        code: config.code.success,
                        data: doc,
                        result: newResult
                      });
                    }
                  });
              }
            });
          }
        });
      }

      // 扫描录入时, 传入result的name 根据name来确定reference的id
      if (newResult.name && !newResult.reference) {
        SheetReference.findOne({name: newResult.name}, (err, doc) => {
          if (!err && doc) {
            newResult.reference = doc._id;
          } else if (!doc) {
            const newSheetRef = new SheetReference();
            newSheetRef.name = newResult.name;
            newSheetRef.save((err) => {
              if (err) {
                reject({msg: "ocr根据result的name创建新reference诗出错"});
              } else {
                newResult.reference = newSheetRef._id;
              }
            });
          }
          newResult.save((error) => {
            if (error) {
              reject({msg: '化验结果添加失败'});
            } else {
              Sheet.findOneAndUpdate({_id: sheet},
                {"$push": {results: newResult._id}},
                {new: true}, (err, doc) => {
                  if (err) {
                    console.log(err.message);
                    reject({msg: '化验单添加结果失败',});
                  } else {
                    resolve({
                      code: config.code.success,
                      data: doc,
                      result: newResult
                    });
                  }
                });
            }
          });
        });
      }
    }
  });
}
