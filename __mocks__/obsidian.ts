// This file is required to exclude obsidian package dependency from jest unit tests
import * as Moment from 'moment';
const momentInstance: typeof Moment = Moment;
console.log(momentInstance.default());
export { momentInstance as moment }