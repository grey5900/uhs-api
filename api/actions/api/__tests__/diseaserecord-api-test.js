/*
 * Copyright(c) omk 2016
 * Filename: diseaserecord-api-test.js
 * Author  : Zheng Jiawei <zjw@omk.io>
 * Create  : 26 7月 2016.
 */
import chai from 'chai';
import mongoose from 'mongoose';
import request from 'supertest';
import config from '../../config';
import testconfig from './config';
import Patient from '../../models/Patient';

const should = chai.should();
const url = testconfig.url;
const db = testconfig.db;

mongoose.connect(db);

describe('患者信息管理#', ()=> {


  it('新增患者', (done)=> {

    var data = {
      "patient": {
        "birthday": "1991-11-15T16:00:00.000Z",
        "real_name": "zheng",
        "person_id": "610428199111165055",
        "age": 24,
        "gender": "Male",
        "mobile": "151-5067-5069"
      }, "medicare": {"type": "country", "number": "0101"}, "contact": ""
    };
    var headers = {'x-hospital': "56d071b5d97bcd188e2be379"};
    request(url)
      .post('/patient/create')
      .set(headers)
      .send(data)
      .end((err, res) => {
        if (err) {
          console.log('err:', err);
          done(err);
        } else {
          res.status.should.be.equal(200);
          res.body.code.should.be.equal(config.code.success);
          done();
        }
      });
  });


  it('删除患者', (done)=> {

    Patient.findOne({person_id: '610428199111165055'}, (err, doc)=> {
      if (err) {
        console.log(err);
        done(err);
      }
      let id = doc._id;
      request(url)
        .post('/patient/remove')
        .send({id: id})
        .end((err, res) => {
          if (err) {
            console.log('err:', err);
            done(err);
          } else {
            res.status.should.be.equal(200);
            done();
          }
        });
    });

  });


});


describe('患者#相关病史', () => {

  // 每例测试前新增用户
  beforeEach((done)=> {

    var data = {
      "patient": {
        "birthday": "1991-11-15T16:00:00.000Z",
        "real_name": "zheng",
        "person_id": "610428199111165055",
        "age": 24,
        "gender": "Male",
        "mobile": "151-5067-5069"
      }, "medicare": {"type": "country", "number": "0101"}, "contact": ""
    };

    request(url)
      .post('/patient/create')
      .send(data)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });

  // 每例测试后删除测试用户
  afterEach((done)=> {

    Patient.findOne({person_id: '610428199111165055'}, (err, doc)=> {
      if (err) {
        console.log(err);
        done(err);
      }
      let id = doc._id;
      request(url)
        .post('/patient/remove')
        .send({id: id})
        .end((err, res) => {
          if (err) {
            console.log('err:', err);
            done(err);
          } else {
            done();
          }
        });
    });
  });

  describe('添加接口', ()=> {

    it('添加既往史', (done)=> {

      var data = {
        "args": [{
          "symptom": [{"name": "系统", "value": "呼吸系统"}, {"name": "病情稳定", "value": "稳定"}],
          "name": "既往史",
          "description": "11",
          "patient": {
            "_id": "5796d6d397223ef4ec8b8200",
            "record": {
              "_id": "5796d6d397223ef4ec8b8202",
              "hospital": {
                "_id": "56d071b5d97bcd188e2be379",
                "address": "高朋东路1号",
                "area": "高新区",
                "city": "成都",
                "province": "四川",
                "name": "成都高新博力医院",
                "__v": 0,
                "create_time": "2016-02-26T15:39:33.417Z"
              },
              "patient": "5796d6d397223ef4ec8b8200",
              "__v": 0,
              "create_time": "2016-07-26T03:19:47.463Z",
              "deleted": false,
              "idiopathy": [],
              "complication": [],
              "sheet": [],
              "prescription": [],
              "order": []
            },
            "medicare": {
              "_id": "5796d6d397223ef4ec8b8201",
              "patient": "5796d6d397223ef4ec8b8200",
              "type": "country",
              "number": "1111",
              "__v": 0,
              "create_time": "2016-07-26T03:19:47.461Z",
              "deleted": false
            },
            "birthday": "1991-11-15T16:00:00.000Z",
            "real_name": "aa",
            "person_id": "610428199111165055",
            "mobile": "151-5011-5011",
            "hospital": {
              "_id": "56d071b5d97bcd188e2be379",
              "address": "高朋东路1号",
              "area": "高新区",
              "city": "成都",
              "province": "四川",
              "name": "成都高新博力医院",
              "__v": 0,
              "create_time": "2016-02-26T15:39:33.417Z"
            },
            "__v": 0,
            "create_time": "2016-07-26T03:19:47.460Z",
            "deleted": false,
            "is_reviewer": false,
            "dialysis_schedule_days": "1-3-5",
            "treat_plans": [],
            "marital_status": "",
            "education_degree": "",
            "gender": "Male",
            "contact": [{}],
            "type": "ckd",
            "id": "5796d6d397223ef4ec8b8200"
          }
        }]
      };
      request(url)
        .post('/diseaserecord/create')
        .send(data)
        .end((err, res) => {
          if (err) {
            console.log('err:', err);
          } else {
            //console.log(res.body);
            res.body.code.should.be.equal(config.code.success);
            res.body.data[0].name.should.be.equal('既往史');
            done();
          }
        })
    });


    it('添加家族史', (done)=> {

      var data = {
        "args": [{
          "symptom": [{"name": "肾脏疾病", "value": false}, {
            "name": "肿瘤",
            "value": true
          }, {"name": "肾病疾病类型", "value": "慢性肾小球肾炎"}, {"name": "输血", "value": "A型血"}],
          "tags": ["1"],
          "name": "家族史",
          "patient": {
            "_id": "5796d6d397223ef4ec8b8200",
            "record": {
              "_id": "5796d6d397223ef4ec8b8202",
              "hospital": {
                "_id": "56d071b5d97bcd188e2be379",
                "address": "高朋东路1号",
                "area": "高新区",
                "city": "成都",
                "province": "四川",
                "name": "成都高新博力医院",
                "__v": 0,
                "create_time": "2016-02-26T15:39:33.417Z"
              },
              "patient": "5796d6d397223ef4ec8b8200",
              "__v": 0,
              "create_time": "2016-07-26T03:19:47.463Z",
              "deleted": false,
              "idiopathy": [],
              "complication": [],
              "sheet": [],
              "prescription": [],
              "order": []
            },
            "medicare": {
              "_id": "5796d6d397223ef4ec8b8201",
              "patient": "5796d6d397223ef4ec8b8200",
              "type": "country",
              "number": "1111",
              "__v": 0,
              "create_time": "2016-07-26T03:19:47.461Z",
              "deleted": false
            },
            "birthday": "1991-11-15T16:00:00.000Z",
            "real_name": "aa",
            "person_id": "610428199111165055",
            "mobile": "151-5011-5011",
            "hospital": {
              "_id": "56d071b5d97bcd188e2be379",
              "address": "高朋东路1号",
              "area": "高新区",
              "city": "成都",
              "province": "四川",
              "name": "成都高新博力医院",
              "__v": 0,
              "create_time": "2016-02-26T15:39:33.417Z"
            },
            "__v": 0,
            "create_time": "2016-07-26T03:19:47.460Z",
            "deleted": false,
            "is_reviewer": false,
            "dialysis_schedule_days": "1-3-5",
            "treat_plans": [],
            "marital_status": "",
            "education_degree": "",
            "gender": "Male",
            "contact": [{}],
            "type": "ckd",
            "id": "5796d6d397223ef4ec8b8200"
          }
        }]
      };
      request(url)
        .post('/diseaserecord/create')
        .send(data)
        .end((err, res) => {
          if (err) {
            console.log('err:', err)
          } else {
            res.body.code.should.be.equal(config.code.success);
            done();
          }
        })
    });

  });

  describe('更新接口', ()=> {

    it('更新相关病史', (done)=> {

      var data = {
        "args": [{
          "_id": "5796dad697223ef4ec8b8203",
          "diagnosis": {
            "_id": "5796dad697223ef4ec8b8204",
            "creator": "5701f8477c192eb809c1fe5d",
            "patient": "5796d6d397223ef4ec8b8200",
            "name": "原发性肾小球疾病",
            "stage": "二期",
            "__v": 0,
            "deleted": false,
            "create_time": "2016-07-26T03:36:54.144Z",
            "attachments": [],
            "results": []
          },
          "start_time": "2001-01-01T00:00:00.000Z",
          "name": "肾病病史",
          "patient": {
            "_id": "5796d6d397223ef4ec8b8200",
            "record": {
              "_id": "5796d6d397223ef4ec8b8202",
              "hospital": {
                "_id": "56d071b5d97bcd188e2be379",
                "address": "高朋东路1号",
                "area": "高新区",
                "city": "成都",
                "province": "四川",
                "name": "成都高新博力医院",
                "__v": 0,
                "create_time": "2016-02-26T15:39:33.417Z"
              },
              "patient": "5796d6d397223ef4ec8b8200",
              "__v": 0,
              "create_time": "2016-07-26T03:19:47.463Z",
              "deleted": false,
              "idiopathy": [],
              "complication": [],
              "sheet": [],
              "prescription": [],
              "order": []
            },
            "medicare": {
              "_id": "5796d6d397223ef4ec8b8201",
              "patient": "5796d6d397223ef4ec8b8200",
              "type": "country",
              "number": "1111",
              "__v": 0,
              "create_time": "2016-07-26T03:19:47.461Z",
              "deleted": false
            },
            "birthday": "1991-11-15T16:00:00.000Z",
            "real_name": "aa",
            "person_id": "610428199111165055",
            "mobile": "151-5011-5011",
            "hospital": {
              "_id": "56d071b5d97bcd188e2be379",
              "address": "高朋东路1号",
              "area": "高新区",
              "city": "成都",
              "province": "四川",
              "name": "成都高新博力医院",
              "__v": 0,
              "create_time": "2016-02-26T15:39:33.417Z"
            },
            "__v": 0,
            "create_time": "2016-07-26T03:19:47.460Z",
            "deleted": false,
            "is_reviewer": false,
            "dialysis_schedule_days": "1-3-5",
            "treat_plans": [],
            "marital_status": "",
            "education_degree": "",
            "gender": "Male",
            "contact": [{}],
            "type": "ckd",
            "id": "5796d6d397223ef4ec8b8200"
          },
          "__v": 0,
          "create_time": "2016-07-26T03:36:54.142Z",
          "deleted": false,
          "symptom": [],
          "tags": ["1"],
          "id": "5796dad697223ef4ec8b8203"
        }, {
          "_id": "5796dc7d97223ef4ec8b8205",
          "description": "11",
          "name": "既往史",
          "patient": {
            "_id": "5796d6d397223ef4ec8b8200",
            "record": {
              "_id": "5796d6d397223ef4ec8b8202",
              "hospital": {
                "_id": "56d071b5d97bcd188e2be379",
                "address": "高朋东路1号",
                "area": "高新区",
                "city": "成都",
                "province": "四川",
                "name": "成都高新博力医院",
                "__v": 0,
                "create_time": "2016-02-26T15:39:33.417Z"
              },
              "patient": "5796d6d397223ef4ec8b8200",
              "__v": 0,
              "create_time": "2016-07-26T03:19:47.463Z",
              "deleted": false,
              "idiopathy": [],
              "complication": [],
              "sheet": [],
              "prescription": [],
              "order": []
            },
            "medicare": {
              "_id": "5796d6d397223ef4ec8b8201",
              "patient": "5796d6d397223ef4ec8b8200",
              "type": "country",
              "number": "1111",
              "__v": 0,
              "create_time": "2016-07-26T03:19:47.461Z",
              "deleted": false
            },
            "birthday": "1991-11-15T16:00:00.000Z",
            "real_name": "aa",
            "person_id": "610428199111165055",
            "mobile": "151-5011-5011",
            "hospital": {
              "_id": "56d071b5d97bcd188e2be379",
              "address": "高朋东路1号",
              "area": "高新区",
              "city": "成都",
              "province": "四川",
              "name": "成都高新博力医院",
              "__v": 0,
              "create_time": "2016-02-26T15:39:33.417Z"
            },
            "__v": 0,
            "create_time": "2016-07-26T03:19:47.460Z",
            "deleted": false,
            "is_reviewer": false,
            "dialysis_schedule_days": "1-3-5",
            "treat_plans": [],
            "marital_status": "",
            "education_degree": "",
            "gender": "Male",
            "contact": [{}],
            "type": "ckd",
            "id": "5796d6d397223ef4ec8b8200"
          },
          "__v": 0,
          "create_time": "2016-07-26T03:43:57.472Z",
          "deleted": false,
          "symptom": [{"name": "系统", "value": "呼吸系统", "_id": "5796dc7d97223ef4ec8b8207"}, {
            "name": "病情稳定",
            "value": "稳定",
            "_id": "5796dc7d97223ef4ec8b8206"
          }],
          "tags": [],
          "id": "5796dc7d97223ef4ec8b8205"
        }]
      };
      request(url)
        .post('/diseaserecord/update')
        .send(data)
        .end((err, res) => {
          if (err) {
            console.log('err:', err)
          } else {
            res.body.code.should.be.equal(config.code.success);
            done();
          }
        });
    });
    
  });

});
