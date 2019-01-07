/**
 * Created by isaac on 1/22/16.
 */
import config from '../config';
import drugList from './drug';

import SqliteToMongo from './importer';

export default function () {

  const importer = new SqliteToMongo('docs/drug_2016_01_15.db', config.db);
  const callback = (err, num) => {
    if (err) {
      console.log(err);
    } else {
      console.log('imported: ', num);
    }
  };
  var list = drugList.slice(0, 1);
  list = drugList;
  importer.exec(() => {
    list.forEach((name) => {
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
        where: ' where cnName like "%' + name + '%" or commonName like "%' + name + '%" '
      });
    });
  });
};
