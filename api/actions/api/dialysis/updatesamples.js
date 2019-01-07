/**
 * Created by isaac on 16/6/20.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {judge} from '../message/observers';
import constants from '../message/observers/constants';
import {getTime} from '../../lib/util';
import {roleAuthPromise as rap} from '../../lib/auth';
const DialysisItem = mongoose.model('DialysisItem');

export default function(req, params, ctx) {
  return rap(req, 'update', 'DialysisItem', (resolve, reject) => {
    const {id, samples} = req.body;
    judge(constants.dialysisSamples, req, {id, ...ctx});

    DialysisItem.findOneAndUpdate({_id: id}, {samples, update_time: getTime()}, (error) => {
      if (error) {
        console.log(error);
        reject({msg: error.message});
      } else {
        resolve({code: config.code.success});
      }
    });
  });
}
