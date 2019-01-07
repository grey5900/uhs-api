/*
 * Copyright(c) omk 2016
 * Filename: PathologicDiagnosis-api-test.js
 * Author  : Zheng Jiawei <zjw@omk.io>
 * Create  : 26 7月 2016.
 */
import chai from 'chai';
import mongoose from 'mongoose';
import request from 'supertest';
import config from '../../config';
import testconfig from './config';
import PathologicDiagnosis from '../../models/PathologicDiagnosis';

const should = chai.should();
const url = testconfig.url;
const db = testconfig.db;

mongoose.connect(db);

// choose a patient to run the test!
const id = '57958bdfd35ef97d6ff046f8';


var data = null;

describe('患者#病理诊断', () => {

  // save date before run the test
  beforeEach((done)=> {
    
    PathologicDiagnosis.findById(id, (err, doc)=> {
      data = doc;
    });
    done();
  });

  // recover data after the test
  afterEach((done)=> {
    
    request(url)
      .post('/pathologicdiagnosis/update')
      .send(data)
      .end((err, res) => {
        if (err) {
          //console.log(err);
          return done(err);
        }
        res.body.code.should.be.equal(config.code.success);
        done();
      });
  });

  it('添加疾病类型', (done) => {

    var update_data = {
      "_id": id, "classify": "原发性肾小球疾病",
      "patient": "56d071b6d97bcd188e2be37b", "deleted": false, "create_time": "2016-07-25T03:47:43.448Z",
      "tubule_other": [], "tubule": [], "genetic_other": [], "genetic": [], "secondary_other": [], "secondary": [],
      "primary_other": ["哈哈test", "hehe "],
      "primary": ["毛细血管内增殖性肾炎", "膜增殖性肾炎", "新月体肾炎", "硬化性肾炎"],//添加"硬化性肾炎"
      "date": "2016-07-24"
    };
    request(url)
      .post('/pathologicdiagnosis/update')
      .send(update_data)
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        res.body.code.should.be.equal(config.code.success);
        //判断新增的疾病"硬化性肾炎"是否已添加成功;
        PathologicDiagnosis.findById(id, (err, doc)=> {
          if (doc.primary.indexOf('硬化性肾炎') != -1) {
            done();
          }
        });
      });
  });

  it('添加其他状况', (done) => {

    var update_data = {
      "_id": id, "classify": "原发性肾小球疾病",
      "patient": "56d071b6d97bcd188e2be37b", "deleted": false, "create_time": "2016-07-25T03:47:43.448Z",
      "tubule_other": [], "tubule": [], "genetic_other": [], "genetic": [], "secondary_other": [], "secondary": [],
      "primary_other": ["just for mocha test", "hehe "],
      "primary": ["毛细血管内增殖性肾炎", "膜增殖性肾炎", "新月体肾炎"],
      "date": "2016-07-24"
    };
    request(url)
      .post('/pathologicdiagnosis/update')
      .send(update_data)
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        //console.log(res);
        res.body.code.should.be.equal(config.code.success);
        PathologicDiagnosis.findById(id, (err, doc)=> {
          if (doc.primary_other.indexOf('just for mocha test') != -1) {
            done();
          }
        });
      });
  });

});

