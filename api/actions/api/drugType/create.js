/**
 * Created by isaac on 16/3/4.
 */
import mongoose from 'mongoose';
import config from '../../config';
const DrugType = mongoose.model('DrugType');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function create(req) {

  return rap(req, 'create', 'DrugType', (resolve, reject) => {

    const {name} = req.body;

    if (name) {
      const info = {
        ...req.body,
        deleted: false
      };
      const drugType = new DrugType(info);
      drugType.save((error) => {
        if (error) {
          console.log(error.message);
          reject({msg: name + '添加失败！'});
        } else {
          resolve({
            code: config.code.success,
            data: drugType
          });
        }
      });
    } else {
      reject({msg: '缺少参数！'});
    }
  });
}

