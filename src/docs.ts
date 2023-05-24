import {readFileSync, writeFileSync} from 'fs';
import dedent from 'ts-dedent';
import {DropdownOption} from './option';
import {RuleType, rules} from './rules';
import './rules-registry';

const autogen_warning = '<!--- This file was automatically generated. See docs.ts and *_template.md files for the source. -->\n';

// README

generateReadme();

// Rules documentation

generateDocs();

function generateReadme() {
  const readme_template = readFileSync('./docs/templates/readme_template.md', 'utf8');

  let rules_list = '';
  let prevSection = '';
  for (const rule of rules) {
    if (rule.type !== prevSection) {
      rules_list += `\n### ${rule.type} rules\n\n`;
      prevSection = rule.type;
    }
    rules_list += `- [${rule.alias}](${rule.getURL()})\n`;
  }

  const readme = autogen_warning + readme_template.replace('{{RULES PLACEHOLDER}}', rules_list);
  writeFileSync('README.md', readme);
  console.log('README.md updated');
}

function generateDocs() {
  // const rules_template = readFileSync('./docs/templates/rules_template.md', 'utf8');

  let rules_docs = '';
  let prevSection = '';
  for (const rule of rules) {
    const examples = rule.examples.map((test) => dedent`
      <details><summary>${test.description}</summary>
      ${''}
      Before:
      ${''}
      \`\`\`\`\`\` markdown
      ${test.before}
      \`\`\`\`\`\`
      ${''}
      After:
      ${''}
      \`\`\`\`\`\` markdown
      ${test.after}
      \`\`\`\`\`\`
      </details>
    `).join('\n');

    const options_list = rule.options.slice(1).map((option) => {
      let listItems = '';
      if (option instanceof DropdownOption) {
        let listItemNumber = 0;
        for (const record of option.options) {
          const nameParts = record.value.split('.');
          let name = '';
          if (nameParts.length === 1) {
            name = nameParts[0];
          } else {
            name = nameParts[nameParts.length - 1];
          }

          // accounts for the fact that one of the rules has a period as its list value
          if (name == '') {
            name = '.';
          }

          if (listItemNumber > 0) {
            listItems += '<br/><br/>';
          }
          listItems += `\`${name}\`: ${record.description}`;
          listItemNumber++;
        }
      }
      listItems = listItems || 'N/A';

      let defaultValue = option.defaultValue;
      if (defaultValue != '') {
        defaultValue = `\`${defaultValue}\``;
      }
      const text = dedent`
        | \`${option.getName()}\` | ${option.getDescription()} | ${listItems} | ${defaultValue} |
      `;


      return text;
    }).join('\n');
    let options = '';
    if (options_list.length > 0) {
      options = dedent`
        Options:

        | Name | Description | List Items | Default Value |
        | ---- | ----------- | ---------- | ------------- |
        ${options_list}
      `;
    }

    if (rule.type !== prevSection) {
      if (prevSection !== '') {
        writeRuleDocument(prevSection, rules_docs);
      }

      rules_docs = '';
      prevSection = rule.type;
    }

    rules_docs += dedent`
      ${''}
      ### ${rule.getName()}
      ${''}
      Alias: \`${rule.alias}\`
      ${''}
      ${rule.getDescription()}
      ${''}
      ${options}
      ${''}
      Examples:
      ${''}
      ${examples}
      ${''}
    `;
  }

  writeRuleDocument(prevSection, rules_docs);

  // const rules_documentation = dedent`
  //   ${autogen_warning}
  //   ${''}
  //   ${rules_template}
  //   ${''}
  //   ${rules_docs}
  // `;

  // writeFileSync('./docs/rules.md', rules_documentation);
  console.log('Rules documentation updated');
}

function writeRuleDocument(ruleTypeName: string, rules_docs: string) {
  const rules_documentation = dedent`
    ${autogen_warning}
    ${''}
    # ${ruleTypeName} Rules
    ${rules_docs}
  `;

  writeFileSync(`./docs/docs/settings/${ruleTypeName.toLowerCase()}-rules.md`, rules_documentation);
}
