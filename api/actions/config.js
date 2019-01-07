/**
 * Created by isaac on 15/10/28.
 */
import path from 'path';
const uploadFolder = path.join(__dirname, '../uploads');
module.exports = {
  code: {
    success: 1000
  },
  //db: 'mongodb://lxm:123@192.168.199.135:27017/uhs',
  db: 'mongodb://localhost/uhs',
  testDB: 'mongodb://localhost/uhs_test',
  protocol: 'uhs://',
  uploadFolder,
  meta: {
    installed: 'uhs.installed'
  },
  kHost: 'http://hd.cnrds.net/hd/',
  // kHost: 'http://221.123.179.99/hd/',
  kUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6)' +
                            ' AppleWebKit/537.36 (KHTML, like Gecko)' +
                            ' Chrome/51.0.2704.106 Safari/537.36'
};
