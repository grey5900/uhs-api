/**
 * Created by Grey on 16/8/15.
 */
import cheerio from 'cheerio';
import superagent from 'superagent';
import mongoose from 'mongoose';
// import {kHost, kUserAgent} from '../../../config';
import {sequencePromises} from '../../../lib/util';
import '../../../models/Doctor';
import '../../../models/Patient';
import '../../../models/Hospital';
import '../../../models/Sheet';
import '../../../models/Diagnosis';
import {kHost, kUserAgent} from '../../../config';
const Doctor = mongoose.model('Doctor');
const Hospital = mongoose.model('Hospital');
const Diagnosis = mongoose.model('Diagnosis');
const Sheet = mongoose.model('Sheet');
const SheetType = mongoose.model('SheetType');
const SheetResult = mongoose.model('SheetResult');
const SheetReference = mongoose.model('SheetReference');
import upsertQC from '../upsertQC';

// 血常规
const bloodRoutineReferenceMap = {
  3: 0, // 白细胞
  4: 12, // 血红蛋白
  5: 22, // 红细胞压积
  6: 19 // 血小板
};
// 生化1
const bloodBiochemistryMap = {
  18: 13, //尿素(mmol/L)
  20: 14, //肌酐(μmol/L)
  21: 0, //血总蛋白
  22: 1, //血白蛋白
  23: 5, //AST天门冬氨酸转氨酶
  24: 4, //ALT 丙氨酸氨基转移酶
  25: 8, //总胆红素
  26: 15, //甘油三酯
  27: 16, //总胆固醇
  28: 17, //低密度脂蛋白
  29: 18 //高密度脂蛋白
};
// 肝炎病毒学检验+HIV抗体+梅毒抗体
const HBVMap = {
  39: 0, //HBsAg 乙肝表面抗原定性
  41: 2//HBeAg 乙肝E抗原定性
};
// 贫血全套+铁四项
const ironMetabolismMap = {
  12: 7, //血清铁
  13: 4, //总铁结合力
  14: 5, //转铁饱和度
  15: 0  //铁蛋白
};
function getTextInRow($, rowObjects, index) {
  return $(rowObjects[index]).text().trim();
}

function saveSheet($, sheetTypeName, rowObjects, reportTimeIndex, patientID, valueMap) {
  return new Promise((resolve, reject) => {
    SheetType.findOne({name: sheetTypeName})
      .populate('references')
      .exec((error, type) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          const report_time = getTextInRow($, rowObjects, reportTimeIndex);
          if (report_time && report_time.length > 1) {
            const sheet = new Sheet();
            sheet.type = type.id;
            sheet.patient = patientID;

            sheet.report_time = new Date(report_time);
            Object.keys(valueMap).forEach(key => {
              const value = getTextInRow($, rowObjects, key);
              const referenceIndex = valueMap[key];

              const ref = type.references[referenceIndex];
              const result = new SheetResult();
              result.value = value;
              result.name = ref.name;
              result.short_name = ref.short_name;
              result.reference = ref.id;
              result.save((error) => {
                if (error) {
                  console.log(error);
                  reject();
                } else {
                  resolve();
                }
              });

              sheet.results.push(result);
            });
            sheet.save((error) => {
              if (error) {
                console.log(error);
                reject();
              } else {
                resolve();
              }
            });
          } else {
            resolve();
          }
        }
      });
  });
};
const upsertExam = ($, rowObjects, patientID, primaryDisease) => {
  const date = $(rowObjects[2]).text().trim();
  const creatinine1 = $(rowObjects[19]).text().trim();
  const creatinine2 = $(rowObjects[20]).text().trim();
  const obj = {
    red_blood: $(rowObjects[4]).text().trim(),
    red_pressure: $(rowObjects[5]).text().trim(),
    iron: $(rowObjects[15]).text().trim(),
    ipth: $(rowObjects[10]).text().trim(),
    iron_saturation: $(rowObjects[14]).text().trim(),
    calcium: $(rowObjects[8]).text().trim(),
    phosphorus: $(rowObjects[9]).text().trim(),
    albumin: $(rowObjects[22]).text().trim(),
    triglyceride: $(rowObjects[26]).text().trim(),
    cholesterol: $(rowObjects[27]).text().trim(),
    ldl: $(rowObjects[28]).text().trim(),
    hdl: $(rowObjects[29]).text().trim(),
    sugar: $(rowObjects[30]).text().trim(),
    crp: $(rowObjects[36]).text().trim(),
    kalium: $(rowObjects[31]).text().trim(),
    b2_globin: $(rowObjects[37]).text().trim(),
    creatine: creatinine1 === '' ? `${creatinine2}μmol/L` : `${creatinine1}mg/dl`,
    patient: patientID,
    primary_disease: primaryDisease,
  };
  return upsertQC(date, obj);
};

export default function saveSheetList(chid, cookie, patientID, primaryDisease) {
  return new Promise((resolve, reject) => {

    const request = superagent.get(kHost + 'carehistory.do?action=showmultilist&rid=' + chid + '&sdoctableid=sysjc&modifyflag=window.parent.global_modified&param=jc,0');
    request.set('Cookie', cookie);
    request.set('user-agent', kUserAgent);
    request.end((error, response) => {

      if (error) {
        console.log(error);
        reject();
      } else {
        const $ = cheerio.load(response.text);
        const arr = [
          {name: '血常规', num: 2, obj: bloodRoutineReferenceMap},
          {name: '生化1', num: 16, obj: bloodBiochemistryMap},
          {name: '肝炎病毒学检验+HIV抗体+梅毒抗体', num: 38, obj: HBVMap},
          {name: '贫血全套+铁四项', num: 11, obj: ironMetabolismMap}
        ];
        const trs = $('tr');
        const length = trs.length;
        const promises = [];
        const promises2 = [];
        for (let idx = 1; idx < length; ++idx) {
          const row = trs[idx];
          const rowObjects = $(row).children();
          if (rowObjects.length > 2) {
            promises.concat(arr.map((item) => saveSheet($, item.name, rowObjects, item.num, patientID, item.obj)));
            promises2.push(upsertExam($, rowObjects, patientID, primaryDisease));
          }
        }
        sequencePromises(promises.concat(promises2)).then(resolve);
      }
    });
  });
}
