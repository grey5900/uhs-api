/**
 * Created by isaac on 12/2/15.
 */
module.exports = {
  name: '贫血全套+铁四项',
  references: [
    {
      short_name: 'SF',
      name: '血清铁蛋白',
      reference: '30 - 400',
      unit: 'ng/mL'
    },
    {
      short_name: 'VB12',
      name: '维生素B12',
      reference: '156 - 698',
      unit: 'pmol/L'
    },
    {
      short_name: 'FA',
      name: '叶酸',
      reference: '7.0 - 39.7',
      unit: 'nmol/L'
    },
    {
      short_name: 'EPO',
      name: '促红细胞生成素',
      reference: '4.3 - 29.0',
      unit: 'mIU/mL'
    },
    {
      short_name: 'tFe',
      name: '总铁结合力',
      reference: '40.8 - 76.6',
      unit: 'umol/L'
    },
    {
      short_name: 'TRF%',
      name: '血清转铁蛋白饱和度',
      reference: '16 - 45',
      unit: '%'
    },
    {
      short_name: '-',
      name: '不饱和铁结合力',
      reference: '17.9 - 66.2',
      unit: 'umol/L'
    },
    {
      short_name: 'Fe',
      name: '血清铁',
      reference: '10.0 - 28.3',
      unit: 'umol/L'
    }
  ]
};
