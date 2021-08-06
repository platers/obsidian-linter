import MockDate from 'mockdate'
MockDate.set('2020-01-01');
import { readFileSync, writeFileSync } from "fs";
import dedent from "ts-dedent";
import { rules } from "../rules";

// README

const readme_template = readFileSync("./docs/readme_template.md", "utf8");

const rules_list = rules.map(rule => `- ${rule.name}`).join("\n");

const readme = dedent`
				${readme_template}

				## Rules

				${rules_list}

				`;

writeFileSync("README.md", readme);
console.log("README.md updated");

// Rules documentation

const rules_template = readFileSync("./docs/rules_template.md", "utf8");

const rules_docs = rules.map(rule => {
	const tests = rule.tests.filter(test => test.includeInDocs);
	const examples = tests.map(test => dedent`
		Example: ${test.description}

		Before:

		\`\`\`markdown
		${test.before}
		\`\`\`

		After:

		\`\`\`markdown
		${test.after}
		\`\`\`
	`).join("\n");

	return dedent`
	## ${rule.name}

	${rule.description}

	${examples}

	`
}).join("\n");

const rules_documentation = dedent`
	${rules_template}

	${rules_docs}
	`;

writeFileSync("./docs/rules.md", rules_documentation);
console.log("Rules documentation updated");