import { rules, Test } from './rules';

describe('Rules', () => {
	for (const rule of rules) {
		describe(rule.name, () => {
			test.each(rule.tests)('$description', (testObject: Test) => {
				expect(rule.apply(testObject.before)).toBe(testObject.after);
			});
		});
	}
});