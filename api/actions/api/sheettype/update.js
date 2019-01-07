/**
 * Created by isaac on 16/8/24.
 */
import mongoose from 'mongoose';
import config from '../../config';
const SheetType = mongoose.model('SheetType');
const SheetReference = mongoose.model('SheetReference');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function (req) {

  return rap(req, 'update', 'SheetType', (resolve, reject) => {
    const {id, args} = req.body;
    const {update, remove} = args;
    const newReference = args.new;
    SheetType.findOne({_id: id})
      .populate('references')
      .exec((error, doc) => {
        if (error) {
          console.log(err);
          reject({msg: '更新失败！'});
        } else if (doc) {
          if (update) {
            const {_id, __v, ...rest} = update;
            SheetReference.findOneAndUpdate({_id}, rest, error => {
              if (error) {
                console.log(error);
              }
            });
          } else if (newReference) {
            const newRef = new SheetReference(newReference);
            newRef.save();
            doc.references.push(newRef);
          } else if (typeof remove !== 'undefined') {
            doc.references.splice(remove, 1);
          }
          doc.save(error => {
            if (error) {
              console.log(err);
              reject({msg: '更新失败！'});
            } else {
              resolve({code: config.code.success});
            }
          });
        } else {
          reject({msg: '化验单类型不存在！'});
        }
      });
  });
}
