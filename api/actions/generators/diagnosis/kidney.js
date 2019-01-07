/**
 * Created by yons on 16/3/14.
 */
export default [
  {
    name: '肾小球疾病综合症',
    options: [{name: '急性肾炎综合症'}, {name: '急进性肾炎综合症'}, {name: '慢性肾炎综合症'},
      {name: '肾病综合症'}, {name: '无症状蛋白尿'}, {name: '肉眼血尿'}, {name: '镜下血尿'}],
  },
  {
    name: '肾小管间质疾病',
    options: [
      {name: '急性间质性肾炎', options: ['药物相关', '感染相关', '特发性']},
      {name: '慢性间质性肾炎', options: ['药物相关', '感染相关', '特发性']},
      {name: '泌尿系统感染'},
      {name: '泌尿系统结石'},
      {name: '梗阻性疾病'},
      {name: '反流性疾病'},
      {name: '肾小管功能障碍', options: ['肾性糖尿', '肾性氨基酸尿', '肾小管酸性中毒', '肾性尿崩症']}
    ]
  },
  {name: '环境与职业因素', options: [{name: '过量运动'}, {name: '金属中毒'}, {name: '有机溶剂'}], note: ''},
  {name: '药物性肾损害', options: [{name: '马兜铃酸类中药'}, {name: '止痛剂'}, {name: '造影剂'}], note: ''},
  {
    name: '自身免疫性与结缔组织性疾病',
    options: [{name: '系统性红斑狼疮肾损害'}, {name: '原发性小血管肾炎损害'}, {name: '过敏性紫癜性肾炎'},
      {name: '原发性干燥综合症肾损害'}, {name: '强直性脊柱炎肾脏损害'}, {name: '银屑病肾损害'}, {name: '混合型结缔组织病肾损害'},
      {name: '类风湿性关节炎肾损害'}]
  },
  {
    name: '代谢性疾病肾损害',
    options: [{name: '糖尿病肾病'}, {name: '高尿酸血症肾病'}, {name: '肾淀粉样变性病'}, {name: '骨髓瘤肾脏损害'}, {name: '轻链沉积病'},
      {name: '高钙性肾病'}, {name: '低钾性肾病'}], note: ''
  },
  {name: '心血管疾病肾损害', options: [{name: '高血压'}]},
  {
    name: '感染性疾病相关肾',
    options: [{name: '乙型肝炎病毒相关性肾炎'}, {name: '肾综合症出血症'}, {name: '丙型肝炎病毒相关性肾炎'}, {name: '扁桃体炎'}],
    note: ''
  },
  {name: '血栓性微血管病', options: [{name: '抗磷脂综合症'}, {name: '肾脏静血栓'}, {name: '肾动脉血栓及栓塞'}, {name: '胆固醇结晶'}]},
  {
    name: '终末期疾病',
    options: [{name: '多系统器官衰竭'}, {name: '肝硬化肾损害'}, {name: '肝肾综合症'}, {name: '心力衰竭'}, {name: '呼吸衰竭'}],
    note: ''
  },
  {name: '恶性肿瘤相关肾损害', options: [{name: '白血病肾损害'}, {name: '淋巴瘤损害'}, {name: '实体肿瘤损害'}, {name: '肿瘤治疗过程中的肾损害'}]},
  {
    name: '遗传性与囊肿性肾脏病',
    options: [{name: 'Alport综合症'}, {name: '薄基底膜肾病'}, {name: '常染色体显性多囊肾病'}, {name: '单纯性肾囊肿'}],
    note: ''
  },
  {name: '肾脏功能诊断', options: [{name: '急性肾损害'}, {name: '慢性肾功能不全'}, {name: '慢性肾脏病急性加重'}]},
  {
    name: '并发症', options: [{name: '慢性肾衰竭并发症'}, {name: '高血压'}, {name: '低血压'}, {name: '心血管并发症'},
    {name: '肾性贫血'}, {name: '骨代谢异常'}, {name: '感染'}, {name: '代谢性酸中毒'}, {name: '其他电解质紊乱'},
    {name: '神经系统损害'}, {name: '消化系统'}, {name: '呼吸系统'}, {name: '淀粉样变性'}, {name: '皮肤瘙痒'}], note: ''
  },

  {
    name: '原发性肾小球疾病',
    options: [
      {name: '急性肾炎综合征'}, {name: '急进性肾炎综合征'}, {name: '慢性肾炎综合征'}, {name: '肾病综合征'}, {name: '血尿'},
      {name: '孤立性蛋白尿'}], note: ''
  },
  {
    name: '继发性肾小球疾病',
    options: [
      {name: '高血压肾损害'}, {name: '糖尿病肾病'}, {name: '肥胖相关性肾病'}, {name: '淀粉样变性'}, {name: '多发骨髓瘤肾病'},
      {name: '狼疮性肾炎'}, {name: '系统性血管炎肾脏损害'}, {name: '过敏紫癜性肾炎'}, {name: '血栓性微血管病'}, {name: '干燥综合征肾损害'},
      {name: '硬皮病肾损害'}, {name: '类风湿性关节炎和强直性脊柱炎肾损害'}, {name: '银屑病肾损害'}, {name: '乙型肝炎病毒相关性肾炎'},
      {name: '丙型肝炎病毒相关性肾炎'}, {name: 'HIV相关性肾损害'}, {name: '流行性出血热肾损害'}
    ], note: ''
  },
  {
    name: '遗传性及先天性肾病',
    options: [
      {name: '多囊肾病'}, {name: 'Alport综合征'}, {name: '薄基底膜肾病'}, {name: '近端肾小管损害及Fanconi综合征'}, {name: 'Bartter综合征'},
      {name: 'Fabry病'}, {name: '脂蛋白肾病'}
    ], note: ''
  },
  {
    name: '肾小管间质疾病',
    options: [
      {name: '急性肾小管间质性肾炎'}, {name: '慢性肾小管间质性肾炎'}, {name: '急性肾小管坏死'}, {name: '肾小管性酸中毒'}, {name: '反流性肾病'},
      {name: '梗阻性肾病'}, {name: '马兜铃酸肾病'}, {name: '造影剂肾病'}, {name: '重金属中毒性肾脏损害'}, {name: '放射性肾病及抗肿瘤药物所致的肾损害'},
      {name: '放射性肾病及抗肿瘤药物所致的肾损害'}, {name: '痛风性肾病'}
    ], note: ''
  },
  {
    name: '泌尿系感染和结石',
    options: [{name: '慢性肾盂肾炎'}, {name: '泌尿系结核'}, {name: '肾结石'}], note: ''
  },
  {
    name: '肾脏切除原因',
    options: [{name: '肾脏肿瘤'}, {name: '肾结核'}, {name: '肾脏囊肿'}, {name: '肾发育不良'}], note: ''
  },
];
