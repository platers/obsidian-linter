import MockDate from "mockdate"
MockDate.set(new Date(2020, 0, 1));
import dedent from "ts-dedent";
import { rules, Rule, rulesDict, Example, parseOptions } from "./rules";

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
		it("Works normally", () => {
			const before = dedent`
				# H1
				## H2
				Line
				### H3
				`;
			const after = dedent`
				# H1

				## H2

				Line
				
				### H3
				`;
			expect(rulesDict["heading-blank-lines"].apply(before)).toBe(after);
		});
	});
	describe("List spaces", () => {
		it("Handles empty bullets", () => {
			const before = dedent`
				Line
				- 1
				- 
				Line
				`;
			const after = dedent`
				Line
				- 1
				- 
				Line
				`;
			expect(rulesDict["space-after-list-markers"].apply(before)).toBe(after);
		});
	});
});

describe("Option parsing", () => {
	it("Basic case", () => {
		const line = "yaml-timestamp";
		expect(parseOptions(line)).toEqual({});
	});
	it("No quotes", () => {
		const line = "yaml-timestamp format=YYYY-MM";
		expect(parseOptions(line)).toEqual({
			"format": "YYYY-MM",
		});
	});
	it("Single quotes", () => {
		const line = "yaml-timestamp format='YYYY-MM'";
		expect(parseOptions(line)).toEqual({
			"format": "YYYY-MM",
		});
	});
	it("Double quotes", () => {
		const line = 'yaml-timestamp format="YYYY-MM"';
		expect(parseOptions(line)).toEqual({
			"format": "YYYY-MM",
		});
	});
	it("Many options", () => {
		const line = `yaml-timestamp format="YYYY - MM" time=3 arg='123' `;
		expect(parseOptions(line)).toEqual({
			"format": "YYYY - MM",
			"time": "3",
			"arg": "123",
		});
	});
	it("Nested quotes", () => {
		const line = `yaml-timestamp format="YYYY '-' MM"`;
		expect(parseOptions(line)).toEqual({
			"format": "YYYY '-' MM",
		});
	});
});