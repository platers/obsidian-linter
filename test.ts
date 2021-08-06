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

// test("newlines_around_headings", () => {
// 	const text = `
// # H1
// ## H2


// # H1
// line`;
// 	const expected = `

// # H1

// ## H2

// # H1

// line`;
// 	expect(rules['newlines_around_headings'](text)).toBe(expected);
// });

// test("newlines_around_headings ignore codeblocks", () => {
// 	const text = `
// # H1
// \`\`\`
// # comment not header
// a = b
// \`\`\``;
// 	const expected = `

// # H1

// \`\`\`
// # comment not header
// a = b
// \`\`\``;
// 	expect(rules['newlines_around_headings'](text)).toBe(expected);
// });