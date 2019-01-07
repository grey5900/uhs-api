/**
 * Created by isaac on 16/5/6.
 */
import request from 'request';

const metaList = [
  /* {
   value: 'meta.options.kidneytype',
   name: '肾炎类型',
   list: kidneyTypeOption
   },
   {
   value: 'meta.options.diagnosis',
   name: '诊断类型',
   list: diagnosisOptions
   },
   {
   value: 'meta.options.patienttype',
   name: '患者类型',
   list: patientTypeOptions
   },
   {
   value: 'meta.options.medicaretype',
   name: '医保类型',
   list: medicareTypeOptions
   },
   {
   value: 'meta.options.sheettype',
   name: '化验单类型',
   list: sheetOptions
   },
   {
   value: 'meta.options.doctor.schedule',
   name: '医护班次',
   list: [
   {value: 0, name: '休班'},
   {value: 1, name: '早班'},
   {value: 2, name: '中班'},
   {value: 3, name: '晚班'},
   ]
   },
   {
   value: 'meta.options.machine.area',
   name: '机器分区',
   list: [
   {value: 0, name: 'A区'},
   {value: 1, name: 'B区'}
   ]
   },
   {
   value: 'meta.options.schedule.dialysis.order',
   name: '透析班次',
   list: [
   {value: 0, name: '早'},
   {value: 1, name: '中'},
   {value: 2, name: '晚'},
   ]
   },
   {
   value: 'meta.options.machine.type',
   name: '机器治疗类型',
   list: [
   {value: 0, name: 'HD'},
   {value: 1, name: 'HDF'}
   ]
   } */
  {
    value: 'meta.options.role',
    name: '角色',
    list: [
      {value: 'Admin', name: '用户'},
      {value: 'CureDiary', name: '病程'},
      {value: 'DialysisSupply', name: '耗材'},
      {value: 'DrugType', name: '药品类型'},
      {value: 'MachineBrand', name: '透析机品牌'},
      {value: 'Outcome', name: '转归'},
      {value: 'Prescription', name: '处方'},
      {value: 'SheetType', name: '化验单类型'},

      {value: 'AllergyDiagnosis', name: '过敏诊断'},
      {value: 'Diagnosis', name: '诊断'},
      {value: 'Disease', name: '疾病'},
      {value: 'File', name: '文件'},
      {value: 'Medicare', name: '医保'},
      {value: 'PathologicDiagnosis', name: '病理诊断'},

      {value: 'DiseaseRecord', name: '相关疾病'},
      {value: 'FollowupRecord', name: '随访记录'},
      {value: 'Message', name: '消息'},
      {value: 'Patient', name: '患者'},
      {value: 'Record', name: '病历'},
      {value: 'TreatPlan', name: '治疗方案'},

      {value: 'DiagnosisType', name: '诊断类型'},
      {value: 'DiseaseType', name: '疾病类型'},
      {value: 'Hospital', name: '医院'},
      {value: 'Meta', name: '配置'},
      {value: 'Peritoneal', name: '腹透'},
      {value: 'Sheet', name: '化验单'},
      {value: 'UserEvent', name: '事件'},

      {value: 'Contact', name: '联系方式'},
      {value: 'DialysisItem', name: '透析单'},
      {value: 'Doctor', name: '医护信息'},
      {value: 'KidneyBasic', name: '肾功基础'},
      {value: 'NutritionAssessment', name: '营养评估'},
      {value: 'PhysicalExam', name: '体格检查'},

      {value: 'DialysisMachine', name: '透析机'},
      {value: 'Drug', name: '药品'},
      {value: 'KidneyDiagnosis', name: '肾病诊断'},
      {value: 'Order', name: '医嘱'},
      {value: 'SheetResult', name: '化验单结果'},

      {value: 'DoctorSchedule', name: '医护班'},
      {value: 'PatientSchedule', name: '血透班'},
      {value: 'DialysisPlan', name: '透析治疗方案'},
      {value: 'CnrdsQC', name: '质检报告'}
    ]
  }
];

export default function init(baseURL) {
  const url = baseURL + '/meta/create';

  metaList.forEach((info) => {
    if (typeof info.hidden === 'undefined') {
      info.hidden = false;
    }
    request({
      url: url,
      method: 'POST',
      json: true,
      body: info
    }, (error, response, body) => {
      console.log(error, response.statusCode, body);
    });
  });
}
