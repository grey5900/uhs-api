/*
 * Copyright(c) omk 2016
 * Filename: gaiji.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期二, 16 八月 2016.
 */


var cheerio = require('cheerio');
var fs = require('fs');

fs.readFile('./gaiji.html', function(err, data) {
  if (err) {
    console.log(err);
  } else {
    const $ = cheerio.load(data);
    const tds = $('td');
    const result = [];
    for(var i = 8; tds[i]; i=i+5) {
      let obj = {};
      for (var j = i; j < i+5; j++) {
        var data = tds[j];
        if (data && data.children[0] && data.children[0].data) {
          obj[j] = data.children[0].data.trim();
        }
      }
      result.push(obj);
    }
    console.log('tds', tds[16].children[0].data.trim(), result);
  }
});
