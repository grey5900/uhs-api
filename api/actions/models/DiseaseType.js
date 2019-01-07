/*****************************************************************
*   Copyright (C) 2015 All rights reserved.
*    ___  __  __ _  __          ____            _           _
*   / _ \|  \/  | |/ /         |  _ \ _ __ ___ (_) ___  ___| |_
*  | | | | |\/| | ' /   _____  | |_) | '__/ _ \| |/ _ \/ __| __|
*  | |_| | |  | | . \  |_____| |  __/| | | (_) | |  __/ (__| |_
*   \___/|_|  |_|_|\_\         |_|   |_|  \___// |\___|\___|\__|
*                                            |__/
*   Filename : DiseaseType.js
*   Author   : chris Lin(lc@omk.io)
*   Date     : Wed Nov 11 16:44:05 2015
*   Describe : the uhp project -- omk!
*
*****************************************************************/
var mongoose = require('mongoose');
import {getTime} from '../lib/util';

//疾病的类型
var DiseaseTypeSchema = mongoose.Schema({
    name        : String,

    deleted     : {type: Boolean, default: false},
  update_time   : {type: Number, default: getTime },
    create_time : {type: Date, default: Date.now}
});

module.exports = mongoose.model('DiseaseType', DiseaseTypeSchema);
