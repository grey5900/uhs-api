/**
 * Created by isaac on 16/8/16.
 */
var mongoose = require('mongoose');

// 各表的同步时间记录
var SyncTimeSchema = mongoose.Schema({

  name         : String, // 表名
  update_time   : {type: Number},
});

module.exports = mongoose.model('SyncTime', SyncTimeSchema);