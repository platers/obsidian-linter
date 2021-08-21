import MockDate from "mockdate"
MockDate.set(new Date(2020, 0, 1));
import dedent from "ts-dedent";
import { rules, Rule, rulesDict, Example } from "./rules";

describe("Examples pass", () => {
	for (const rule of rules) {
		describe(rule.name, () => {
			test.each(rule.examples)("$description", (testObject: Example) => {
				expect(rule.apply(testObject.before)).toBe(testObject.after);
			});
		});
	}
});

describe("Check missing fields", () => {
	test.each(rules)("$name", (rule: Rule) => {
		expect(rule.name).toBeTruthy();
		expect(rule.description).toBeTruthy();
		expect(rule.examples.length).toBeGreaterThan(0);
	});
});

describe("Rules tests", () => {
	describe("Heading blank lines", () => {
		it("Ignores codeblocks", () => {
			const before = dedent`
				# H1
				\`\`\`
				# comment not header
				a = b
				\`\`\``;
			const after = dedent`
				# H1

				\`\`\`
				# comment not header
				a = b
				\`\`\``;
			expect(rulesDict["heading-blank-lines"].apply(before)).toBe(after);
		});
		it("Ignores # not in headings", () => {
			const before = dedent`
				Not a header # .
				Line
				`;
			const after = dedent`
				Not a header # .
				Line
				`;
			expect(rulesDict["heading-blank-lines"].apply(before)).toBe(after);
		});
	});
});