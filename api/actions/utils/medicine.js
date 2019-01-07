/**
 * Created by isaac on 2016/4/2.
 */
import config from '../config';
import SqliteToMongo from './importer';
import DrugType from '../models/DrugType';
import Drug from '../models/Drug';
import Company from '../models/Company';
import generators from '../generators';

const list = [
  //低分子肝素
  {name: '低分子肝素钙', query: 'select * from drug where commonName like "%低分子%肝素钙%"'},
  {name: '低分子肝素钠', query: 'select * from drug where commonName like "%低分子%肝素钠%" or commonName like "%依诺%肝素%"'},
  {name: '促红素', query: 'select * from drug where commonName like "%促红素%"'},
  {name: '铁剂', query: 'select * from drug where commonName like "%蔗糖铁%"'},
  {name: '降压药', query: 'select * from drug where commonName like "%苯磺酸左旋氨氯地平片%" or commonName like "%盐酸贝那%" ' +
                          ' or commonName like "%琥珀酸美托洛尔%"'},
  {name: 'PTH', query: 'select * from drug where commonName like "%骨化三醇%"'}
];

export default function () {
  DrugType.count({}, (err, count) => {
    if (err) {
      console.log('drugtype count error');
    } else if (count === 0) {
      generators();
      const importer = new SqliteToMongo('docs/drug_2016_01_15.db', config.db);
      importer.exec(() => {
        importer.importCollection('companys', {
          tableName: 'company',
          columns: {
            id: 'raw_id',
            cnName: 'name',
            engName: 'en_name',
            description: 'description',
            shortName: 'short_name',
            createDate: 'create_time',
            phone: 'phone'
          },
          query: 'select * from company'
        }, () => {
          list.forEach((info) => {
            DrugType.findOne({name: info.name}, (error, doc) => {
              if (doc) {
                importer.exec(() => {
                  importer.importCollection('drugs', {
                    tableName: "drug",
                    columns: {
                      id: 'raw_id',
                      cnName: 'name',
                      commonName: 'common_name',
                      engName: 'en_name',
                      vsName: 'vs_name',
                      showName: 'show_name',
                      otherName: 'other_name',
                      companyId: 'company_id',

                      FDA: 'FDA',
                      component: 'component',
                      indication: 'indication',
                      dosage: 'dosage',
                      contraindications: 'contraindications',
                      precautions: 'precautions',
                      adverseReactions: 'adverse_reactions',
                      drugInteractions: 'drug_interactions',
                      forensicClassification: 'forensic_classification',
                      type: 'type',
                      pack: 'pack',
                      OTC: 'OTC',
                      grade: 'grade',
                      cateId1: 'category_id',
                      priceId: 'price_id',
                      warning: 'warning',
                    },
                    presets: {
                      type: doc._id
                    },
                    query: info.query
                  });
                });
              } else {
                console.log('type not found: ', info);
              }
            });
          });
        });
      });
    }
  });
};
