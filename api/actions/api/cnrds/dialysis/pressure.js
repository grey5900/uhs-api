/**
 * Created by Grey on 16/8/16.
 */
var cheerio = require('cheerio');
var fs = require('fs');

fs.readFile('./pressure.html', function(error, data) {
  if (error) {
    console.log(error);
  } else {
    const $ = cheerio.load(data);
    const text = function(i) {
      const tds = $('tr:nth-child(3) td');
      return $(tds[i]).text().replace(/(^\s*)|(\s*$)/g, "");
    };
    // 血压测量
    const date = text(2); // 检查日期
    const postion = text(3); // 测量部位
    const afterSBP = text(4); // 透析前收缩压
    const afterDBP = text(5); // 透析前舒张压
    const beforeSBP = text(6); // 透析后收缩压
    const beforeDBP = text(7); // 透析后舒张压
    const normalSBP = text(8); // 非透析日收缩压
    const normalDBP = text(9); // 非透析日舒张压

    const pressure = {
      date,
      postion,
      afterSBP,
      afterDBP,
      beforeSBP,
      beforeDBP,
      normalSBP,
      normalDBP
    };

    console.log(pressure);
  }
});