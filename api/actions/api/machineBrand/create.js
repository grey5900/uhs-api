/**
 * Created by Grey on 16/6/23.
 */
import mongoose from 'mongoose';
import config from '../../config';
const MachineBrand = mongoose.model('MachineBrand');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function create(req) {

  return rap(req, 'create', 'MachineBrand', (resolve, reject) => {
    const hospital = req.headers["x-hospital"];
    const info = {
      ...req.body,
      hospital,
      deleted: false
    };
    const {name, model} = info;

    MachineBrand.findOne({name, model}, (error, doc) => {
      if (error) {
        console.log(error);
        reject({msg: '创建失败!'});
      } else {
        if (doc) {
          reject({msg: `品牌: ${name} 型号: ${model}已存在!`});
        } else {
          const machineBrand = new MachineBrand(info);
          machineBrand.save((error) => {
            if (error) {
              reject({msg: '添加失败！'});
            } else {
              resolve({
                code: config.code.success,
                data: machineBrand
              });
            }
          });
        }
      }
    });
  });
}
