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

// Rules documentation

const rules_template = readFileSync("./docs/rules_template.md", "utf8");

const rules_docs = rules.map(rule =>
	dedent`
	## ${rule.name}

	${rule.description}

	`
).join("\n");

const rules_documentation = dedent`
	${rules_template}

	${rules_docs}
	`;

writeFileSync("./docs/rules.md", rules_documentation);