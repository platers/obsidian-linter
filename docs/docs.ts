import { readFileSync, writeFileSync } from "fs";
import dedent from "ts-dedent";
import { rules } from "../rules";
// Read template
const readme_template = readFileSync("./docs/readme_template.md", "utf8");

const rules_list = rules.map(rule => `- ${rule.name}`).join("\n");

const readme = dedent`
				${readme_template}

				## Rules

				${rules_list}

				`;

console.log(readme);

writeFileSync("README.md", readme);

