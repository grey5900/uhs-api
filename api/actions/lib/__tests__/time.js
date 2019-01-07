/**
 * Created by isaac on 16/3/1.
 */
import moment from 'moment';

var now = moment(new Date()); //todays date
var end = moment("2015-12-1"); // another date
var duration = moment.duration(now.diff(end));
var days = duration.asDays();
console.log(days);

