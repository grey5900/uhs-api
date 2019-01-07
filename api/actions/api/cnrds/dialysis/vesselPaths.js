/**
 * Created by Grey on 16/8/15.
 */
var cheerio = require('cheerio');
var fs = require('fs');

fs.readFile('./vesselPaths.html', function(error, data) {
  if (error) {
    console.log(error);
  } else {
    const $ = cheerio.load(data);
    const text = function(i) {
      const tds = $('tr:nth-child(3) td');
      return $(tds[i]).text().replace(/(^\s*)|(\s*$)/g, "");
    };
    // 血压测量
    const date = text(2);
    const type = text(3);
    const sides = text(4);
    // ['颈内静脉', '股静脉', '锁骨下静脉', '颈外静脉']
    // ['前臂', '上臂', '下肢']
    const place = text(5);
    const conterMethods = text(6); // 中心静脉置管方法
    const reason = text(7);
    const otherReason = text(8);
    const otherType = text(9);

    const vesselPaths = {
      date,
      type,
      sides,
      place,
      conterMethods,
      reason,
      otherReason,
      otherType
    };
    console.log(vesselPaths);
  }
});