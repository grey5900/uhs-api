/**
 * Created by isaac on 16/7/20.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {judge} from '../message/observers';
import constants from '../message/observers/constants';
import {getTime} from '../../lib/util';
import {roleAuthPromise as rap} from '../../lib/auth';
const DialysisItem = mongoose.model('DialysisItem');

export default function(req, params, ctx) {
  return rap(req, 'create', 'DialysisItem', (resolve, reject) => {
    const {id, samples} = req.body;
    judge(constants.dialysisSingleSample, req, {id, ...ctx});

    DialysisItem.findOne({_id: id}, (error, doc) => {
      if (error) {
        console.log(error);
        reject({msg: error.message});
      } else {
        doc.samples.push(samples);
        doc.update_time = getTime();
        doc.save((error) => {
          if (error) {
            console.log(error);
            reject({msg: error.message});
          } else {
            resolve({code: config.code.success});
          }
        });
      }
    });
  });
}
