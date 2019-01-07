/**
 * Created by yons on 16/4/1.
 */
import mongoose from 'mongoose';
import config from '../../config';
import url from 'url';
import generateDateDuration from '../../utils/searchDate';
import {roleAuthPromise} from '../../lib/auth';
const DoctorSchedule = mongoose.model('DoctorSchedule');
const PatientSchedule = mongoose.model('PatientSchedule');

export default function search(req) {

    const obj = url.parse(req.url, true);
    const {search, type} = obj.query;
    let skip = parseInt(obj.query.skip);
    let limit = parseInt(obj.query.limit);
    if (!skip) {
      skip = 0;
    }
    if (!limit) {
      limit = 20;
    }
    if (search) {
      const exp = new RegExp(search, 'i');
      if (type === 'patient') {
        return roleAuthPromise(req, 'read', 'PatientSchedule', (resolve, reject) => {
          const args = {
            $and: [
              {deleted: false},
              {is_template: false},
              {
                $or: [
                  {schedule_week: exp},
                ]
              }
            ]
          };
          PatientSchedule.count(args, (error, count) => {
            if (error) {
              reject({msg: error.message});
            } else {
              if (count === 0) {
                resolve({
                  code: config.code.success,
                  data: {
                    total: 0,
                    schedules: []
                  }
                });
              } else {
                PatientSchedule.find(args)
                  .select('-__v')
                  .skip(skip)
                  .limit(limit)
                  .populate('creator')
                  .sort({schedule_date: -1})
                  .exec((err, docs) => {
                    if (err) {
                      console.log(err);
                      reject({msg: '查找失败！'});
                    } else {
                      resolve({
                        code: config.code.success,
                        data: {
                          total: count,
                          schedules: docs
                        }
                      });
                    }
                  });
              }
            }
          });
        });
      } else {
        return roleAuthPromise(req, 'read', 'DoctorSchedule', (resolve, reject) => {
          let str = null;
          if (search.length <= 2) {
            // only have month
            str = `${new Date().getFullYear()}_${parseInt(search, 10)}`;
          } else {
            let array = search.split('-');
            array = array.map((item) => parseInt(item, 10));
            str = array.join('_');
          }
          const weekExp = new RegExp(str, 'i');
          const args = {
            $and: [
              {deleted: false},
              {is_template: false},
              {schedule_week: weekExp}
            ]
          };
          DoctorSchedule.count(args, (error, count) => {
            if (error) {
              reject({msg: error.message});
            } else {
              if (count === 0) {
                resolve({
                  code: config.code.success,
                  data: {
                    total: 0,
                    schedules: []
                  }
                });
              } else {
                DoctorSchedule.find(args)
                  .select('-__v')
                  .skip(skip)
                  .limit(limit)
                  .sort({schedule_date: -1})
                  .deepPopulate('items.doctor')
                  .populate('creator items')
                  .exec((err, docs) => {
                    if (err || !docs) {
                      console.log(err);
                      reject({msg: '查找失败！'});
                    } else {
                      resolve({
                        code: config.code.success,
                        data: {
                          total: count,
                          schedules: docs
                        }
                      });
                    }
                  });
              }
            }
          });
        });
        }
    } else {
      reject({msg: '缺少参数!'});
    }
}
