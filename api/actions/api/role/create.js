/**
 * Created by Grey on 16/9/4.
 */
import mongoose from 'mongoose';
import config from '../../config';
const Role = mongoose.model('Role');
const Meta = mongoose.model('Meta');

export default function (req) {
  return new Promise((resolve, reject) => {
    Meta.findOne({value: 'meta.options.role'})
      .exec((error, meta) => {
        if (error) {
          console.log(error);
          reject({msg: error.message});
        } else {
          if (meta) {
            const info = {
              ...req.body,
              deleted: false
            };
            const {list = []} = meta;
            const role = new Role(info);
            list.forEach(looper => role.permissions.push({model: looper.value, name: looper.name, allow: []}));
            role.save((error) => {
              if (error) {
                console.log(error);
                reject({msg: '创建失败'});
              } else {
                resolve({
                  code: config.code.success,
                  data: role
                });
              }
            });
          } else {
            reject({msg: '创建失败，请先增添 meta.options.role 记录'});
          }
        }
      });
  });
}
