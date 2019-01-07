/**
 * Created by isaac on 12/2/15.
 */
module.exports = {
  name: '血常规',
  references: [
    {
      short_name: 'WBC',
      name: '白细胞计数',
      reference: '3.97 - 9.15',
      unit: 'X10E9/L'
    },
    {
      short_name: 'NEUT%',
      name: '中性粒细胞百分率',
      reference: '50.0 - 70.0',
      unit: ''
    },
    {
      short_name: 'LYMPH%',
      name: '淋巴细胞百分率',
      reference: '20.0 - 40.0',
      unit: ''
    },
    {
      short_name: 'MONO%',
      name: '单核细胞百分率',
      reference: '3.0 - 10.0',
      unit: ''
    },
    {
      short_name: 'EO%',
      name: '嗜酸性粒细胞百分率',
      reference: '0.5 - 5.0',
      unit: ''
    },
    {
      short_name: 'BASO%',
      name: '嗜碱性粒细胞百分率',
      reference: '0.0 - 1.0',
      unit: ''
    },
    {
      short_name: 'NEUT#',
      name: '中性粒细胞绝对值',
      reference: '2.00 - 7.50',
      unit: 'X10E9/L'
    },
    {
      short_name: 'LYMPH#',
      name: '淋巴细胞绝对值',
      reference: '1.0 - 3.5',
      unit: 'X10E9/L'
    },
    {
      short_name: 'MONO#',
      name: '单核细胞绝对值',
      reference: '0.12 - 1.00',
      unit: 'X10E9/L'
    },
    {
      short_name: 'EO#',
      name: '嗜酸性粒细胞绝对值',
      reference: '0.02 - 0.50',
      unit: 'X10E9/L'
    },
    {
      short_name: 'BASO#',
      name: '嗜碱性粒细胞绝对值',
      reference: '0.00 - 0.10',
      unit: 'X10E9/L'
    },
    {
      short_name: 'RBC',
      name: '红细胞计数',
      reference: '4.09 - 5.74',
      unit: 'X10E12/L'
    },
    {
      short_name: 'HGB',
      name: '血红蛋白',
      reference: '131 - 172',
      unit: 'g/L'
    },
    {
      short_name: 'HCT',
      name: '红细胞压积',
      reference: '38.0 - 50.8',
      unit: ''
    },
    {
      short_name: 'MCV',
      name: '平均红细胞体积',
      reference: '83.9 - 99.1',
      unit: 'fl'
    },
    {
      short_name: 'MCH',
      name: '平均血红蛋白含量',
      reference: '27.8 - 33.8',
      unit: 'pg'
    },
    {
      short_name: 'MCHC',
      name: '平均血红蛋白浓度',
      reference: '320 - 355',
      unit: 'g/L'
    },
    {
      short_name: 'RDW%',
      name: '红细胞分布宽度CV',
      reference: '11.5 - 14.5',
      unit: ''
    },
    {
      short_name: 'RDW',
      name: '红细胞分布宽度SD',
      reference: '35.0 - 56.0',
      unit: 'fl'
    },
    {
      short_name: 'PLT',
      name: '血小板计数',
      reference: '85 - 303',
      unit: 'X10E9/L'
    },
    {
      short_name: 'PDW',
      name: '血小板分布宽度',
      reference: '15.0 - 17.0',
      unit: 'fl'
    },
    {
      short_name: 'MPV',
      name: '平均血小板体积',
      reference: '7.0 - 11.0',
      unit: 'fl'
    },
    {
      short_name: 'PCT',
      name: '血小板压积',
      reference: '0.108 - 0.282',
      unit: ''
    }
  ]
};