/**
 * Created by isaac on 16/5/12.
 */
import mongoose from 'mongoose';
import config from '../../config';
const SheetType = mongoose.model('SheetType');
const SheetReference = mongoose.model('SheetReference');
import {roleAuthPromise as rap} from '../../lib/auth';

export function splitReference(ref) {
  if (ref.indexOf('-') !== -1) {
    return ref.split('-');
  } else if (ref.indexOf('<') !== -1) {
    var result = ref.split('<');
    if (result.length === 1) {
      result.unshift('0');
    }
    return result;
  } else if (ref.indexOf('>') !== -1) {
    var result = ref.split('>');
    if (result.length === 1) {
      result.push(Infinity);
    }
    return result;
  } else {
    return [ref, ref];
  }
}

export default function create(req) {

  return rap(req, 'create', 'SheetType', (resolve, reject) => {
    const {references, ...rest} = req.body;
    var type = new SheetType(rest);
    if (references) {
      references.forEach((info) => {
        var item = new SheetReference(info);
        const {reference} = info;
        const range = splitReference(reference);
        item.min_value = range[0];
        item.max_value = range[1];
        item.deleted = false;
        item.save();
        type.references.push(item);
      });
    }
    type.save((err) => {
      if (err) {
        console.log(err);
        reject({msg: '查找失败！'});
      } else {
        resolve({
          code: config.code.success,
          data: type
        });
      }
    });
  });
}
