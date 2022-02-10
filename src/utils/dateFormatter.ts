import moment from 'moment';

export const dateFormatter = (dateValue: string) => {
  let date;
  switch (dateValue) {
    case 'After 1 hour':
      date = moment().add(1, 'hours');
      break;

    case 'After 6 hours':
      date = moment().add(6, 'hours');
      break;

    case '1 Day':
      date = moment().add(1, 'days');
      break;

    case '3 Days':
      date = moment().add(3, 'days');
      break;

    case '1 Week':
      date = moment().add(7, 'days');
      break;

    default:
      date = moment();
      break;
  }
  return date.unix().toString();
};
