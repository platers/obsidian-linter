// This file is required to exclude obsidian package dependency from jest unit tests
import moment from 'moment';

export {moment as moment};

// Needed to make sure that auto-correct tests work due to the auto-correct option using a modal in some scenarios
export class Modal {}
