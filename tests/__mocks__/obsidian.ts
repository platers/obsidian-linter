import moment from 'moment';

// This file is required to exclude obsidian package dependency from jest unit tests
// const momentModule = jest.requireActual('moment');
// console.log(jest.requireActual('moment'));
// const momentInstance: typeof Moment = Moment;
// console.log(momentInstance.default());
// function getMomentInfo(timestamp: string, format?: string, locale?: string, isValidCheck?: boolean): moment.Moment {
//   if (format != null && locale != null && isValidCheck != null) {
//     return moment(timestamp, format, locale, isValidCheck);
//   } else if (format != null && isValidCheck != null) {
//     return moment(timestamp, format, isValidCheck);
//   } else if (format != null && locale != null) {
//     return moment(timestamp, format, locale);
//   } else if (format != null) {
//     return moment(timestamp, format);
//   }

//   return moment(timestamp);
// }

export {moment as moment};
