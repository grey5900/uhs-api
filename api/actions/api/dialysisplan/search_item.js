/**
 * Created by isaac on 16/8/24.
 */
import mongoose from 'mongoose';
import config from '../../config';
import url from 'url';

const Drug = mongoose.model('Drug');
const DialysisSupply = mongoose.model('DialysisSupply');
const SheetType = mongoose.model('SheetType');

export default function (req) {

  return new Promise((resolve, reject) => {
    const results = {};
    const obj = url.parse(req.url, true);
    const {q} = obj.query;
    if (q && q.length > 0) {
      const exp = new RegExp(q, 'i');

      const promises = [];
      promises.push(new Promise((resolve, reject) => {
        const args = {
          $or: [
            {name: exp},
            {common_name: exp}, //Common Name
            {show_name: exp}, //Display Name
            {other_name: exp}, //Other Name, seperate by `|`
            {pinyin_name: exp}
          ]
        };
        Drug.find(args).exec((error, drugs) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            results.drugs = drugs;
            resolve(drugs);
          }
        });
      }));

      promises.push(new Promise((resolve, reject) => {
        const args = {
          $or: [
            {code: exp},
            {name: exp}, //耗材名称
            {cost_name: exp}, //费用名
          ]
        };
        DialysisSupply.find(args).exec((error, docs) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            results.supplies = docs;
            resolve(docs);
          }
        });
      }));

      promises.push(new Promise((resolve, reject) => {
        SheetType.find({name: exp}).exec((error, types) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            results.sheettypes = types;
            resolve(types);
          }
        });
      }));

      Promise.all(promises).then(() => {
        resolve({
          code: config.code.success,
          data: results
        });
      }, () => {
        reject({msg: '查询失败!'});
      });
    } else {
      resolve({
        code: config.code.success,
        data: {}
      });
    }
  });
}
