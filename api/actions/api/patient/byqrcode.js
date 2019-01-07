/**
 * Created by isaac on 16/3/1.
 */
import mongoose from 'mongoose';
import config from '../../config';
// import {decode as qrdecode} from '../../lib/qrcode';
import url from 'url';
import decode from 'urldecode';
import {roleAuthPromise} from '../../lib/auth';

const Patient = mongoose.model('Patient');

export default function byqrcode(req) {

  return roleAuthPromise(req, 'read', 'Patient', (resolve, reject) => {
    const obj = url.parse(req.url, true);
    let {qrcode} = obj.query;
    qrcode = decode(qrcode);
    const parsedURL = url.parse(qrcode, true);
    const id = parsedURL.query.id;
    if (id) {
      Patient.findOne({_id: id, deleted: false})
        .deepPopulate('hospital medicare record.hospital record.doctor')
        .exec((err, doc) => {
          if (err) {
            console.log(err);
            reject({msg: '查找失败！'});
          } else {
            resolve({
              code: config.code.success,
              data: doc
            });
          }
        });
    } else {
      reject({msg: '非法的QRCode!'});
    }
    /*
     qrdecode(qrcode,
     (result) => {},
     (error) => {
     reject({msg: error});
     });
     */
  });
}
