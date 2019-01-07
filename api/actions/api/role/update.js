/**
 * Created by Grey on 16/9/4.
 */
import mongoose from 'mongoose';
import config from '../../config';
const Role = mongoose.model('Role');

export default function (req) {
  return new Promise((resolve, reject) => {
    const {id, args} = req.body;
    delete args._id;
    Role.findOneAndUpdate({_id: id}, args, (error) => {
      if (error) {
        console.log(error);
        reject({msg: '更新失败'});
      } else {
        resolve({code: config.code.success});
      }
    });
  });
}
