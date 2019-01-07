var cheerio = require('cheerio');
var fs = require('fs');

fs.readFile('./anticoagulant.html', function(error, data) {
  if (error) {
    console.log(error);
  } else {
    const $ = cheerio.load(data);
    const text = function(i) {
      const tds = $('tr:nth-child(3) td');
      return $(tds[i]).text().replace(/(^\s*)|(\s*$)/g, "");
    };
    // 抗凝剂
    const used = text(2); // 是否使用
    const date = text(3); // 日期
    const prescribeHDTime = text(4); // 抗凝剂
    const firstHeparin = text(5); // 肝素首剂量
    const addHeparin = text(6); // 肝素追加剂量
    const totalHeparin = text(7); // 肝素总剂量
    const lowHeparin = text(8); // 低分子肝素
    const lowNa = text(9); // 低分子肝素钠
    const lowOtherNa = text(10); // 其它低分子肝素钠
    const lowCa = text(11); // 低分子肝素钙
    const lowOnterCa = text(12); // 其他低分子肝素钙
    const lowFirstHeparin = text(13); // 低分子肝素首剂量
    const lowAddHeparin = text(14); // 低分子肝素追加剂量
    const lowAddTime = text(15); // 低分子肝素追加时间
    const lowTotal = text(16); // 低分子肝素总剂量
    const otherAnticoagulant = text(17); // 其它抗凝剂
    const firstDose = text(18); // 首剂量
    const addDose = text(19); // 追加剂量
    const totleDose = text(20); // 总剂量

    const abticoagulant = {
      used,
      date,
      prescribeHDTime,
      firstHeparin,
      addHeparin,
      totalHeparin,
      lowHeparin,
      lowNa,
      lowOtherNa,
      lowCa,
      lowOnterCa,
      lowFirstHeparin,
      lowAddHeparin,
      lowAddTime,
      lowTotal,
      otherAnticoagulant,
      firstDose,
      addDose,
      totleDose
    };

    console.log(abticoagulant, '抗凝剂');
  }
});