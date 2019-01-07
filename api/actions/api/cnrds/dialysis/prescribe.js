/**
 * Created by Grey on 16/8/16.
 */
var cheerio = require('cheerio');
var fs = require('fs');

fs.readFile('./vesselPaths.html', function(error, data) {
  if (error) {
    console.log(error);
  } else {
    const $ = cheerio.load(data);
    const tds = $('tr:nth-child(3) td');
    // 处方
    const prescribeDate = $(tds[3]).text();
    const prescribeHDNum = $(tds[4]).text(); // HD次数
    const prescribeHDTime = $(tds[5]).text(); // HD治疗时间
    const prescribeHDFNum = $(tds[6]).text(); // HDF次数
    const prescribeHDFOther = $(tds[7]).text(); // 其它HDF次数说明
    const prescribeHDFTime = $(tds[8]).text(); // HDF治疗时间
    const prescribeHPNum = $(tds[9]).text(); // HP次数
    const prescribeHPTime = $(tds[10]).text(); // HP治疗时间
    // 透析浓缩液
    const dislysate = $(tds[11]).text(); // 透析浓缩液
    const dislysateA = $(tds[12]).text(); // 透析浓缩A液
    const dislysateK = $(tds[13]).text(); // 透析液钾离子浓度
    const dislysateOtherK = $(tds[14]).text(); // 其他钾离子浓度值
    const dislysateCa = $(tds[15]).text(); // 透析液钙离子浓度
    const dislysateOtherCa = $(tds[16]).text(); // 其他鈣离子浓度值
    const dislysateSugar = $(tds[17]).text(); // 含糖透析液
    const concentrateGABA = $(tds[18]).text(); // 氨基酸透析液
    const dislysateB = $(tds[19]).text(); // 透析浓缩B液
    // 透析器、滤器
    const dialyserType = $(tds[20]).text(); // 类型
    const dialyser = $(tds[21]).text(); // 通量
    const dialyserUse = $(tds[22]).text(); // 使用
    const dialyserMembrane = $(tds[23]).text(); // 透析膜
    const dialyserOther = $(tds[24]).text(); // 其它请说明
    const dialyserMembraneArea = $(tds[25]).text(); // 膜面积
  }
});