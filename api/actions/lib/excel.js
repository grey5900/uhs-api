/**
 * Created by jiang_mac on 16/1/26.
 */
var path = require('path');
var XLSX = require('xlsx');

function datenum(v, date1904) {
    if(date1904) v+=1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
    var ws = {};
    var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
    for(var R = 0; R != data.length; ++R) {
        for(var C = 0; C != data[R].length; ++C) {
            if(range.s.r > R) range.s.r = R;
            if(range.s.c > C) range.s.c = C;
            if(range.e.r < R) range.e.r = R;
            if(range.e.c < C) range.e.c = C;
            var cell = {v: data[R][C] };
            if(cell.v == null) continue;
            var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
            if(typeof cell.v === 'number') cell.t = 'n';
            else if(typeof cell.v === 'boolean') cell.t = 'b';
            else if(cell.v instanceof Date) {
                cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            }
            else cell.t = 's';
            ws[cell_ref] = cell;
        }
    }
    if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}

function statusRename(name) {
    if(name == 'Init'){
        return '未开始'
    }
    else if(name == 'Going'){
        return '进行中'
    }
    else if(name == 'NotFinished'){
        return '未完成'
    }
    else if(name == 'InReview'){
        return '审核中'
    }
    else if(name == 'InCheck'){
        return '验收中'
    }
    else if(name == 'Finished'){
        return '已完成'
    }
    else if(name == 'Canceled'){
        return '取消'
    }
}

function dateString(dateData) {
    var date = new Date(dateData);
    return date.getFullYear() + '年' + (date.getMonth()+1) + '月' + date.getDate() + '日';
}

function exportLabors(workbook, labors) {

    var data = [];
    data.push(['执行人', '开始时间', '项目名称', '劳务类型', '任务状态', '薪酬', '完成时间' , '审核人']);
    for(var i = 0; i < labors.length; i++) {
        data.push([
            labors[i].assignee ? labors[i].assignee.real_name : '---',
            labors[i].start_time ? dateString(labors[i].start_time) : '---',
            labors[i].name ? labors[i].name : '---',
            labors[i].type ? labors[i].type.name : '---',
            statusRename(labors[i].status),
            labors[i].payment ? labors[i].payment : '---',
            labors[i].dead_line ? dateString(labors[i].dead_line) : '---',
            labors[i].reviewer ? labors[i].reviewer.real_name : '---'
        ]);
    }
    var ws_name = '劳务信息';
    var ws = sheet_from_array_of_arrays(data);
    workbook.SheetNames.push(ws_name);
    workbook.Sheets[ws_name] = ws;
}

function exportXLSX(res, labors) {
    /* original data */
    function Workbook() {
        if(!(this instanceof Workbook)) return new Workbook();
        this.SheetNames = [];
        this.Sheets = {};
    }
    var wb = new Workbook();
    exportLabors(wb, labors);
    /* write file */
    var name = new Date().getTime() + Math.random().toString(36).substring(7);
    name += '.xlsx';
    name = 'public/' + name;
    XLSX.writeFile(wb, name);
    res.sendFile(name, {root : path.resolve(__dirname, '../..')});

}
module.exports = {
    export : exportXLSX
}
