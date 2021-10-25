import {readFileSync, writeFileSync} from 'fs';
import dedent from 'ts-dedent';
import {DropdownOption} from './option';
import {rules} from './rules';

const autogen_warning = '<!--- This file was automatically generated. See docs.ts and *_template.md files for the source. -->';

// README

generateReadme();

// Rules documentation

generateDocs();

function generateReadme() {
  const readme_template = readFileSync('./docs/readme_template.md', 'utf8');

  const rules_list = rules.map((rule) => `- [${rule.alias()}](${rule.getURL()})`).join('\n');

  const readme = readme_template.replace('{{RULES PLACEHOLDER}}', rules_list);
  writeFileSync('README.md', readme);
  console.log('README.md updated');
}

function generateDocs() {
  const rules_template = readFileSync('./docs/rules_template.md', 'utf8');

  let rules_docs = '';
  let prevSection = '';
  for (const rule of rules) {
    const examples = rule.examples.map((test) => dedent`
    Example: ${test.description}

    Before:

    \`\`\`markdown
    ${test.before}
    \`\`\`

    After:

    \`\`\`markdown
    ${test.after}
    \`\`\`
  `).join('\n');

    const options_list = rule.options.slice(1).map((option) => {
      let text = dedent`
                  - ${option.name}: ${option.description}
                  \t- Default: \`${option.defaultValue}\``;

      if (option instanceof DropdownOption) {
        for (const record of option.options) {
          text += `\n\t- \`${record.value}\`: ${record.description}`;
        }
      }

      return text;
    }).join('\n');
    let options = '';
    if (options_list.length > 0) {
      options = dedent`
      Options:
      ${options_list}
    `;
    }

    if (rule.type !== prevSection) {
      rules_docs += dedent`

      ## ${rule.type}
    `;
      prevSection = rule.type;
    }

    rules_docs += dedent`

  ### ${rule.name}

  Alias: \`${rule.alias()}\`

  ${rule.description}

  ${options}

  ${examples}

  `;
  }

  const rules_documentation = dedent`
  ${autogen_warning}

  ${rules_template}

  ${rules_docs}
  `;

  writeFileSync('./docs/rules.md', rules_documentation);
  console.log('Rules documentation updated');
}

