import dedent from "ts-dedent";
import moment from 'moment';

export class Rule {
	public name: string;
	public description: string;
	public options: Array<string>;
	public apply: (text: string, options?: {[id: string] : string}) => string;

	public examples: Array<Example>;

	constructor(
			name: string, 
			description: string, 
			apply: (text: string, 
				options?: {[id: string] : string}) => string,
			examples: Array<Example>,
			options: Array<string> = []) {
		this.name = name;
		this.description = description;
		this.apply = apply;
		this.examples = examples;
		this.options = options;
	}

	public alias(): string {
		return this.name.replace(/ /g, '-').toLowerCase();
	}
}

export class Example {
	public description: string;
	public options: {[id: string] : string};

	public before: string;
	public after: string;

	constructor(description: string, before: string, after: string, options: {[id: string] : string} = {}) {
		this.description = description;
		this.options = options;
		this.before = before;
		this.after = after;
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
			new Example(
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
		"Heading blank lines",
		"All headings have a blank line both before and after (except where the heading is at the beginning or end of the document).",
		(text: string, options = {"bottom": "true"}) => {
			return ignoreCodeBlocks(text, (text) => {
				if (options["bottom"] === "false") {
					text = text.replace(/(^#+\s.*)\n+/gm, "$1\n");	// trim blank lines after headings
					text = text.replace(/\n+(#+\s.*)/g, "\n\n$1");	// trim blank lines before headings
				} else {
					text = text.replace(/^(#+\s.*)/gm, "\n\n$1\n\n");	// add blank line before and after headings
					text = text.replace(/\n+(#+\s.*)/g, "\n\n$1");	// trim blank lines before headings
					text = text.replace(/(^#+\s.*)\n+/gm, "$1\n\n");	// trim blank lines after headings
				}
				text = text.replace(/^\n+(#+\s.*)/, "$1");	// remove blank lines before first heading
				text = text.replace(/(#+\s.*)\n+$/, "$1");	// remove blank lines after last heading
				return text;
			});
		},
		[
			new Example(
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
			new Example(
				"With `bottom=false`",
				dedent`
				# H1
				line
				## H2
				# H1
				line
				`,
				dedent`
				# H1
				line

				## H2

				# H1
				line
				`,
				{bottom: "false"}
			),
		],
		[
			"bottom: Insert a blank line after headings, default=`true`"
		]
	),
	new Rule(
		`Space after list markers`,
		'There should be a single space after list markers and checkboxes.',
		(text: string) => {
			// Space after marker
			text = text.replace(/^(\s*\d+\.|[-+*])[^\S\r\n]+/gm, "$1 ");
			// Space after checkbox
			return text.replace(/^(\s*\d+\.|[-+*]\s+\[[ xX]\])[^\S\r\n]+/gm, "$1 ");
		},
		[
			new Example(
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
		"Keep track of the date the file was last edited in the YAML front matter. ",
		(text: string, options = {"format": "dddd, MMMM Do YYYY, h:mm:ss a"}) => {
			text = initYAML(text);
			text = text.replace(/\ndate updated:.*\n/, "\n");
			const yaml_end = text.indexOf("\n---");
			return insert(text, yaml_end, `\ndate updated: ${moment().format(options["format"])}`);	
		},
		[
			new Example(
				'Adds a header with the date.',
				dedent`
				# H1
				`,
				dedent`
				---
				date updated: Wednesday, January 1st 2020, 12:00:00 am
				---
				# H1
				`
			),
		],
		[
			'format: [date format](https://momentjs.com/docs/#/displaying/format/), default=`"dddd, MMMM Do YYYY, h:mm:ss a"`',
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
			new Example(
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
				let level = match[2].length;
				if (level == 0) {
					continue;
				}
				if (level > lastLevel + 1) {
					lines[i] = lines[i].replace(headerRegex, `$1${"#".repeat(lastLevel + 1)}$3$4`);
					level = lastLevel + 1;
				}
				lastLevel = level;
			}
			return lines.join("\n");
		},
		[
			new Example(
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
		'Consecutive blank lines',
		'There should be at most one consecutive blank line.',
		(text: string) => {
			return text.replace(/\n{2,}/g, "\n\n");
		},
		[
			new Example(
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
	new Rule(
		"Capitalize Headings",
		"Headings should be formatted with capitalization",
		(text: string, options = { "titleCase": "false", "allCaps": "false" }) => {
			
			const lines = text.split("\n");
			for (let i = 0; i < lines.length; i++) {
				const headerRegex = /^#*\s\w.*/;
				const match = lines[i].match(headerRegex); // match only headings
				if (!match) {
					continue;
				}
				if (options["titleCase"] == "true") {
					return text
				} else if (options["allCaps"] == "true") {
					lines[i] = lines[i].replace(/^#*\s\w.*/, string => string.toUpperCase()) // convert full heading to uppercase
				} else {
					lines[i] = lines[i].replace(/^#*\s([a-z])/, string => string.toUpperCase()) // capitalize first letter of heading
				}
			}
			return lines.join("\n");
		},
		[
			new Example(
				"Headings should be surrounded by blank lines",
				dedent`
				# this is a heading 1
				## this is a heading 2
				`,
				dedent`
				# This is a heading 1
				## This is a heading 2
				`
			),
			new Example(
				"With `titleCase=true`",
				dedent`
				# this is a heading 1
				## this is a heading 2
				`,
				dedent`
				# This is a Heading 1
				## This is a Heading 2
				`,
				{titleCase: "true"}
			),
			new Example(
				"With `allCaps=true`",
				dedent`
				# this is a heading 1
				## this is a heading 2
				`,
				dedent`
				# THIS IS A HEADING 1
				## THIS IS A HEADING 2
				`,
				{allCaps: "true"}
			),
		],
		[
			"titleCase: Format headings with title case capitalization, default=`false`", "allCaps: Format headings with all capitals, default= `false`"
		]
	),
]; 

export const rulesDict = rules.reduce((dict, rule) => (dict[rule.alias()] = rule, dict), {} as Record<string, Rule>);



// Helper functions

// Export parseOptions here so it can be tested
export function parseOptions(line: string) {
	// Match arguments with format: optionName=value or optionName="value" or optionName='value'
	const args = line.matchAll(/\s+(\S+)=("[^"]*"|'[^']*'|\S+)/g);
	const options: { [id: string]: string; } = {};

	for (const arg of args) {
		let [_, option_name, option_value] = arg;

		if (option_value.startsWith("'") && option_value.endsWith("'")) {
			option_value = option_value.slice(1, -1);
		} else if (option_value.startsWith('"') && option_value.endsWith('"')) {
			option_value = option_value.slice(1, -1);
		}

		options[option_name] = option_value;
	}
	return options;
}

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