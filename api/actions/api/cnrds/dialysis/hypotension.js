/**
 * Created by Grey on 16/8/16.
 */
var cheerio = require('cheerio');
var fs = require('fs');

fs.readFile('./hypotension.html', function(error, data) {
  if (error) {
    console.log(error);
  } else {
    const $ = cheerio.load(data);
    const text = function(i) {
      const tds = $('tr:nth-child(3) td');
      return $(tds[i]).text().replace(/(^\s*)|(\s*$)/g, "");
    };
    // 透析充分性
    const date = text(2); // 检查日期
    const height = text(3); // 身高
    const weight = text(4); // 体重
    const BMI = text(5); // BMI
    const bodyArea = text(6); // 体表面积
    const afterUrea = text(7); // 透前尿素
    const beforeUrea = text(8); // 透后尿素
    const dialysisTime = text(9); // 透析时间
    const UFV = text(10); // 超滤量
    const URR = text(11); // URR
    const spKtV = text(12); // spKt/V

    const hypotension = {
      date,
      height,
      weight,
      BMI,
      bodyArea,
      afterUrea,
      beforeUrea,
      dialysisTime,
      UFV,
      URR,
      spKtV
    };
    console.log(hypotension);
  }
});