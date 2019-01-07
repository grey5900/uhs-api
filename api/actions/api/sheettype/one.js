/**
 * Created by isaac on 16/4/13.
 */
import mongoose from 'mongoose';
import config from '../../config';
import url from 'url';
const SheetType = mongoose.model('SheetType');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function one(req) {

  return rap(req, 'read', 'SheetType', (resolve, reject) => {
    const obj = url.parse(req.url, true);
    const {id, name} = obj.query;
    let args = {};
    if (id) {
      args._id = id;
    }
    if (name) {
      args.name = name;
    }
    SheetType.findOne(args)
      .populate('references')
      .exec((err, doc) => {
        if (err) {
          reject({msg: '查找失败'});
        } else {
          resolve({
            code: config.code.success,
            data: doc
          });
        }
      });
  });
}
