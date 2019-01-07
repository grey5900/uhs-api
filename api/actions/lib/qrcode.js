/**
 * Created by isaac on 16/3/1.
 */
import CryptoJS, {AES, SHA1 as sha1} from 'crypto-js';
const secret = '7A9557E6-2558-40D7-87AF-039FB8C36B65';
const key = CryptoJS.enc.Utf8.parse(secret);
const iv = CryptoJS.enc.Utf8.parse(secret);
const salt = '4F2281DE-D0BE-4B6C-8697-948B28FF4C4C';
const checkLength = 5;

export function encode(protocol, payload) {
  let str = protocol + payload;
  const encrypted = AES.encrypt(str, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  str = encrypted.toString();
  const checksum = sha1(str + salt).toString();
  const prefix = checksum.substr(0, checkLength);
  const suffix = checksum.substr(30, checkLength);
  return prefix + str + suffix;
}

export function decode(qrcode, resolve, reject) {
  const length = qrcode.length;
  const prefix = qrcode.substr(0, checkLength);
  const suffix = qrcode.substr(length - checkLength, checkLength);
  const encrypted = qrcode.substr(checkLength, length - 2 * checkLength);
  const checksum = sha1(encrypted + salt).toString();
  if (checksum.substr(0, checkLength) === prefix && checksum.substr(30, checkLength) === suffix) {
    const decrypted = AES.decrypt(encrypted, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    resolve(CryptoJS.enc.Utf8.stringify(decrypted));
  } else {
    reject('Invalid Code!');
  }
}
