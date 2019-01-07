import moment from 'moment';

export default function generateDateDuration(search) {
  if (search && search.length <= 2) {
    // only have month?
    const month = parseInt(search, 10);
    const date = new Date();
    if (month >= 1 && month <= 12) {
      date.setMonth(month - 1);
      let nextDate = moment(date).add(1, 'months').toDate();
      return {date, nextDate};
    } else {
      // invalid
      return {date, nextDate: date};
    }
  } else {
    const date = new Date(search);
    const dateArray = search.split('-');
    let nextDate;
    switch (dateArray.length) {
      case 1:
        nextDate = moment(date).add(1, 'years').toDate();
        break;
      case 2:
        nextDate = moment(date).add(1, 'months').toDate();
        break;
      case 3:
        nextDate = moment(date).add(1, 'days').toDate();
        break;
    }
    return {
      date: date,
      nextDate: nextDate
    }
  }
}
