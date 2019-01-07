/**
 * Created by Grey on 16/8/16.
 */
var cheerio = require('cheerio');
var fs = require('fs');

fs.readFile('./dryWeight.html', function(error, data) {
  if (error) {
    console.log(error);
  } else {
    const $ = cheerio.load(data);
    const text = function(i) {
      const tds = $('tr:nth-child(3) td');
      return $(tds[i]).text().replace(/(^\s*)|(\s*$)/g, "");
    };
    // 干体重
    const date = text(2); // 检查日期
    const info = text(3); // 情况
    const weight = text(4); // 干体重
    const dry = {
      date,
      info,
      weight
    };
    console.log(dry);
  }
});