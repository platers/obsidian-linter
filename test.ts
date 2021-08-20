import MockDate from "mockdate"
import dedent from "ts-dedent";
MockDate.set("2020-01-01");
import { rules, rulesDict, Example } from "./rules";

describe("Examples", () => {
	for (const rule of rules) {
		describe(rule.name, () => {
			test.each(rule.examples)("$description", (testObject: Example) => {
				expect(rule.apply(testObject.before)).toBe(testObject.after);
			});
		});
	}
	MockDate.reset();
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