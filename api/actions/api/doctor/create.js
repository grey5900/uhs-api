import mongoose from 'mongoose';
import config from '../../config';
import {decodeBase64Image, randomString} from '../../lib/util';
import {roleAuthPromise as rap} from '../../lib/auth';
import fs from 'fs';

const Doctor = mongoose.model('Doctor');
const File = mongoose.model('File');

export default function create(req) {
  return rap(req, 'create', 'Doctor', (resolve, reject) => {
    const hospital = req.headers["x-hospital"];
    const info = {
      ...req.body,
      deleted: false,
      hospital
    };
    const {avatarData, ...others} = info;
    const doctor = new Doctor(others);
    if (avatarData) {
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
          file.size = buffer.data.length;
          file.type = 'png';
          file.path = imagePath;
          file.save((error) => {
            if (error) {
              reject({msg: '保存头像失败!'});
            }
          });
          doctor.avatar = file._id;
          doctor.save((error) => {
            if (error) {
              console.log(error);
              reject({msg: '添加失败！'});
            } else {
              resolve({
                code: config.code.success,
                doctor
              });
            }
          });
        }
      })
    } else {
      doctor.save((error) => {
        if (error) {
          console.log(error);
          reject({msg: '添加失败！'});
        } else {
          resolve({
            code: config.code.success,
            doctor
          });
        }
      });
    }

  });
}
