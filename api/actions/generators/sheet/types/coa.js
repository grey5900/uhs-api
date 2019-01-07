/**
 * Created by isaac on 12/2/15.
 */
module.exports = {
  name: '凝血常规',
  references: [
    {
      short_name: 'APTT',
      name: '活化部分凝血活酶时间',
      reference: '21-36.5',
      unit: 'S'
    },
    {
      short_name: 'PT',
      name: '凝血酶原时间',
      reference: '10.7-14.3',
      unit: 'S'
    },
    {
      short_name: 'INR',
      name: 'PT国际标准化比值',
      reference: '0.8-1.3',
      unit: ''
    },
    {
      short_name: 'TT',
      name: '凝血酶时间',
      reference: '10-18',
      unit: 'S'
    },
    {
      short_name: 'FIB',
      name: '纤维蛋白原含量',
      reference: '2-4',
      unit: 'g/L'
    }
  ]
};