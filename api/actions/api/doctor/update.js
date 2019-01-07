import mongoose from 'mongoose';
import config from '../../config';
import fs from 'fs';
import {decodeBase64Image, randomString, getTime} from '../../lib/util';
import {roleAuthPromise as rap} from '../../lib/auth';
const Doctor = mongoose.model('Doctor');
const File = mongoose.model('File');

export default function update(req) {
  return rap(req, 'update', 'Doctor', (resolve, reject) => {
    const {id, args} = req.body;
    const {avatar = {}, avatarData} = args;
    if (id) {

      if (!avatar._id && avatarData) {
        const buffer = decodeBase64Image(avatarData);
        const imageName = `${randomString()}.png`;
        const imagePath = `${config.uploadFolder}/${imageName}`;
        fs.writeFile(imagePath, buffer.data, (err) => {
          if (err) {
            console.log(err);
            reject({msg: '保存头像失败!'});
          } else {
            const file = new File();
            file.name = imageName;
            file.original_name = imageName;
            file.size = buffer.length;
            file.type = 'png';
            file.path = imagePath;
            file.save((error) => {
              if (error) {
                reject({msg: '保存头像失败!'});
              }
            });
            Doctor.findOneAndUpdate({_id: id}, {avatar: file._id}, (err) => {
              if (err) {
                console.log(err);
              }
            })
          }
        })
      } else if (avatar._id && avatarData) {
        const buffer = decodeBase64Image(avatarData);
        const imageName = `${randomString()}.png`;
        const imagePath = `${config.uploadFolder}/${imageName}`;
        fs.writeFile(imagePath, buffer.data, (err) => {
          if (err) {
            console.log(err);
            reject({msg: '保存头像失败!'});
          } else {
            const file = {};
            file.name = imageName;
            file.original_name = imageName;
            file.size = buffer.data.length;
            file.type = 'png';
            file.path = imagePath;
            console.log('file:', file);
            File.findOneAndUpdate({_id: avatar._id}, {...file}, (err) => {
              if (err) {
                console.log(err);
              }
            })
          }
        })
      }
      args.update_time = getTime();
      Doctor.findOneAndUpdate({_id: id}, args, (err) => {
        if (err) {
          console.log(err);
          reject({msg: '更新失败'});
        } else {
          resolve({
            code: config.code.success,
            msg: '更新成功'
          });
        }
      });
    } else {
      reject({msg: '缺少参数'});
    }
  });
}
