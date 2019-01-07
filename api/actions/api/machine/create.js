/**
 * Created by isaac on 16/2/28.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise} from '../../lib/auth';

const DialysisMachine = mongoose.model('DialysisMachine');
const Disease = mongoose.model('Disease');

export function checkMachineIndexWithCallback(index, callback) {
  if (index) {
    DialysisMachine.find({index, deleted: false}, (error, docs) => {
      if (error) {
        console.log(error);
        reject({msg: '操作失败!'});
      } else {
        callback(docs);
      }
    });
  } else {
    callback();
  }
}

export default function (req) {

  return roleAuthPromise(req, 'create', 'DialysisMachine', (resolve, reject) => {
    const hospital = req.headers['x-hospital'];
    const {index} = req.body;
    if (index && hospital) {
      checkMachineIndexWithCallback(index, (machinesInDB) => {
        if (machinesInDB.length > 0) {
          reject({msg: `编号为${index}的机器已存在!`});
        } else {
          let info = {
            ...req.body,
            hospital,
            create_time: new Date(),
            deleted: false
          };
          if (info.infectious_disease.length === 0) {
            delete info.infectious_disease;
          }

          const machine = new DialysisMachine(info);
          machine.save((error) => {
            if (error) {
              console.log(error);
              reject({msg: '添加失败！'});
            } else {
              resolve({
                code: config.code.success,
                data: machine
              });
            }
          });
        }
      });
    } else {
      reject({msg: '缺少参数!'});
    }
  });
}

