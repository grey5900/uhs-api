/**
 * Created by isaac on 16/4/12.
 */
import mongoose from 'mongoose';
import config from '../config';
import '../models/Patient';
import url from 'url';
var Patient = mongoose.model('Patient');
const ObjectId = mongoose.Types.ObjectId;

function parseCondition(inputs) {
  var result = [];
  if (inputs && inputs.length > 0) {
    inputs.forEach((info) => {
      var {field, value} = info;
      var exp = new RegExp(value, 'i');
      var condition = {};
      if (typeof field === 'string') {
        condition[field] = exp;
      } else {
        field.forEach((looper) => {
          condition[looper] = exp;
        });
      }
      result.push(condition);
    });
  }
  return result;
}

export default function search(req) {

  return new Promise((resolve, reject) => {
    var obj = url.parse(req.url, true);
    var hospital = req.headers["x-hospital"];
    if (hospital) {
      let {inputs, optionInputs} = obj.query;
      inputs = JSON.parse(inputs, true);
      optionInputs = JSON.parse(optionInputs, true);
      var args = {
        $and: [
          {deleted: false},
          {hospital: ObjectId(hospital)}
        ]
      };

      var result = parseCondition(inputs);
      args.$and = args.$and.concat(result);

      result = parseCondition(optionInputs);
      args.$and.push({$or: result});
      console.log(args, JSON.stringify(args));
      Patient.find(args)
        .select('-__v')
        .exec((err, docs) => {
          if (err || !docs) {
            console.log(err);
            reject({msg: '查找失败！'});
          } else {
            resolve({
              code: config.code.success,
              data: {
                columns: [],
                data: docs
              }
            });
          }
        });
    } else {
      reject({msg: '缺少参数!'});
    }
  });
}
