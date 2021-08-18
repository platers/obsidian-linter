import dedent from "ts-dedent";

export class Rule {
	public name: string;
	public description: string;
	public apply: (text: string) => string;

	public tests: Array<Test>;

	constructor(name: string, description: string, apply: (text: string) => string, tests: Array<Test>) {
		this.name = name;
		this.description = description;
		this.apply = apply;
		this.tests = tests;
	}

	public alias(): string {
		return this.name.replace(/ /g, '-').toLowerCase();
	}
}

export class Test {
	public description: string;
	public includeInDocs: boolean;

	public before: string;
	public after: string;

	constructor(description: string, before: string, after: string, includeInDocs = true) {
		this.description = description;
		this.before = before;
		this.after = after;
		this.includeInDocs = includeInDocs;
	}
}

export const rules: Rule[] = [
	new Rule(
		"Trailing spaces", 
		"Removes extra spaces after every line.", 
		(text: string) => {
			return text.replace(/[ \t]+$/gm, "");
		},
		[
			new Test(
				"Removes trailing spaces and tabs",
				dedent`
				# H1   
				line with trailing spaces and tabs    				`,
				dedent`
				# H1
				line with trailing spaces and tabs`
			),
		]
	),
	new Rule(
		"Headings should be surrounded by blank lines",
		"All headings have a blank line both before and after (except where the heading is at the beginning or end of the document)",
		(text: string) => {
			return ignoreCodeBlocks(text, (text) => {
				text = text.replace(/(?:^|\n+)(#+ .*)\n+/g, "\n\n$1\n\n");	// add blank line before and after headings
				text = text.replace(/\n+(#+ .*)/g, "\n\n$1");	// trim blank lines before headings
				text = text.replace(/^\n+(#+ .*)/, "$1");	// remove blank lines before first heading
				text = text.replace(/(#+ .*)\n+$/, "$1");	// remove blank lines after last heading
				return text;
			});
		},
		[
			new Test(
				"Headings should be surrounded by blank lines",
				dedent`
				# H1
				## H2


				# H1
				line
				## H2

				`,
				dedent`
				# H1

				## H2

				# H1

				line
				
				## H2
				`
			),
			new Test(
				"Ignores codeblocks",
				dedent`
				# H1
				\`\`\`
				# comment not header
				a = b
				\`\`\``,
				dedent`
				# H1

				\`\`\`
				# comment not header
				a = b
				\`\`\``,
				false
			),
			new Test(
				"Ignores # not in headings",
				dedent`
				Not a header # .
				Line
				`,
				dedent`
				Not a header # .
				Line
				`,
				false
			),
		]
	),
	new Rule(
		`Space after list markers`,
		'There should be a single space after list markers and checkboxes.',
		(text: string) => {
			// Space after marker
			text = text.replace(/^(\s*\d+\.|[-+*])\s+/gm, "$1 ");
			// Space after checkbox
			return text.replace(/^(\s*\d+\.|[-+*]\s+\[[ xX]\])\s+/gm, "$1 ");
		},
		[
			new Test(
				"",
				dedent`
				1.      Item 1
				2.  Item 2

				-   [ ] Item 1
				- [x]    Item 2
				`,
				dedent`
				1. Item 1
				2. Item 2

				- [ ] Item 1
				- [x] Item 2
				`
			),
		]
	),
	new Rule(
		"YAML Timestamp",
		"Keep track of the date the file was last edited in the YAML front matter.",
		(text: string) => {
			text = initYAML(text);
			text = text.replace(/\ndate updated:.*\n/, "\n");
			const yaml_end = text.indexOf("\n---");
			return insert(text, yaml_end, `\ndate updated: ${new Date().toDateString()}`);	
		},
		[
			new Test(
				'Adds a header with the date.',
				dedent`
				# H1
				`,
				dedent`
				---
				date updated: ${new Date().toDateString()}
				---
				# H1
				`
			),
		]
	),
	new Rule(
		"Compact YAML",
		'Removes leading and trailing blank lines in the YAML front matter.',
		(text: string) => {
			text = initYAML(text);
			text = text.replace(/^---\n+/, "---\n");	
			return text.replace(/\n+---/, "\n---");
		},
		[
			new Test(
				"",
				dedent`
				---

				date: today

				---
				`,
				dedent`
				---
				date: today
				---
				`
			),
		]
	),
	new Rule(
		"Header Increment",
		'Heading levels should only increment by one level at a time',
		(text: string) => {
			const lines = text.split("\n");
			let lastLevel = 0;
			for (let i = 0; i < lines.length; i++) {
				const headerRegex = /^(\s*)(#+)(\s*)(.*)$/;
				const match = lines[i].match(headerRegex);
				if (!match) {
					continue;
				}
				const level = match[2].length;
				if (level == 0) {
					continue;
				}
				if (level > lastLevel + 1) {
					lines[i] = lines[i].replace(headerRegex, `$1${"#".repeat(lastLevel + 1)}$3$4`);
				}
				lastLevel = level;
			}
			return lines.join("\n");
		},
		[
			new Test(
				"",
				dedent`
				# H1

				### H3

				We skipped a 2nd level heading
				`,
				dedent`
				# H1

				## H3

				We skipped a 2nd level heading
				`
			),
		]
	),
	new Rule(
		'Multiple consecutive blank lines',
		'There should be at most one consecutive blank line.',
		(text: string) => {
			return text.replace(/\n{2,}/g, "\n\n");
		},
		[
			new Test(
				"",
				dedent`
				Some text


				Some more text
				`,
				dedent`
				Some text

				Some more text
				`
			),
		]
	),
]; 

// Helper functions

function ignoreCodeBlocks(text: string, func: (text: string) => string) {
	const fencedBlockRegex = "```\n((.|\n)*)```";
	const indentedBlockRegex = "((\t|( {4})).*\n)+";
	const codeBlockRegex = new RegExp(`${fencedBlockRegex}|${indentedBlockRegex}`, "g");
	const placeholder = "PLACEHOLDER FOR CODE BLOCK 1038295"
	const matches = text.match(codeBlockRegex);

	text = text.replace(codeBlockRegex, placeholder);
	text = func(text);

	if (matches) {
		for (const match of matches) {
			text = text.replace(placeholder, match);
		}
	}

	return text;
}

function initYAML(text: string) {
	if (text.match(/^---\s*\n.*\n---/s) === null) {
		text = "---\n---\n" + text;
		console.log("inserted yaml");
	}
	return text;
}

function insert(str: string, index: number, value: string) {
    return str.substr(0, index) + value + str.substr(index);
}