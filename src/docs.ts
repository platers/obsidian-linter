import {readFileSync, writeFileSync, existsSync} from 'fs';
import dedent from 'ts-dedent';
import {DropdownOption} from './option';
import {rules, sortRules} from './rules';
import './rules-registry';

const autogen_warning = '<!--- This file was automatically generated. See docs.ts and *_template.md files for the source. -->\n';

const pathToDocsFolder = './docs';

sortRules();

// README

generateReadme();

// Rules documentation

generateDocs();

// Contributing docs

generateContributing();

function generateReadme() {
  const readme_template = readFileSync(`${pathToDocsFolder}/templates/readme_template.md`, 'utf8');

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

    const additionalInfo = getRuleAdditionalInfo(rule.alias);

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
        | \`${option.getName().replaceAll('|', '\\|')}\` | ${option.getDescription().replaceAll('|', '\\|')} | ${listItems} | ${defaultValue} |
      `;


      return text;
    }).join('\n');
    let options = '';
    if (options_list.length > 0) {
      options = dedent`
        ### Options

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

    let additionalInfoSection = '';
    if (additionalInfo != '') {
      additionalInfoSection = dedent`
        ### Additional Info
        ${''}
        ${additionalInfo}
      `;
    }

    rules_docs += dedent`
      ${''}
      ## ${rule.getName()}
      ${''}
      Alias: \`${rule.alias}\`
      ${''}
      ${rule.getDescription()}
      ${''}
      ${options}
      ${''}
      ${additionalInfoSection}
      ${''}
      ### Examples
      ${''}
      ${examples}
      ${''}
    `;
  }

  writeRuleDocument(prevSection, rules_docs);

  console.log('Rules documentation updated');
}

function writeRuleDocument(ruleTypeName: string, rules_docs: string) {
  const rules_documentation = dedent`
    ${autogen_warning}
    ${''}
    # ${ruleTypeName} Rules
    ${getRuleTypeAdditionalInfo(ruleTypeName)}
    ${rules_docs}
  `;

  writeFileSync(`${pathToDocsFolder}/docs/settings/${ruleTypeName.toLowerCase()}-rules.md`, rules_documentation);
}

function getRuleTypeAdditionalInfo(ruleTypeName: string): string {
  let ruleTypeAdditionAlInfo = '';

  const ruleTypeAdditionalInfoPath = `${pathToDocsFolder}/additional-info/rule-types/${ruleTypeName.toLowerCase()}.md`;
  if (existsSync(ruleTypeAdditionalInfoPath)) {
    ruleTypeAdditionAlInfo = '\n' + readFileSync(ruleTypeAdditionalInfoPath, 'utf8');
  }

  return ruleTypeAdditionAlInfo;
}

function getRuleAdditionalInfo(ruleAlias: string): string {
  let ruleAdditionAlInfo = '';

  const ruleAdditionalInfoPath = `${pathToDocsFolder}/additional-info/rules/${ruleAlias}.md`;
  if (existsSync(ruleAdditionalInfoPath)) {
    ruleAdditionAlInfo = '\n' + readFileSync(ruleAdditionalInfoPath, 'utf8');
  }

  return ruleAdditionAlInfo;
}

function generateContributing() {
  const contributing_template = readFileSync(`${pathToDocsFolder}/templates/contributing_template.md`, 'utf8');

  const filesInOrder = [
    'ai-usage.md',
    'getting-setup.md',
    'documentation.md',
    'translation.md',
    'bug-fix.md',
    'refactoring.md',
    'adding-a-rule.md',
    'testing.md',
    'open-a-pr.md',
    'releasing.md',
  ];

  const fileToHeader = new Map<string, string>();
  const fileToContent = new Map<string, string>();

  for (const file of filesInOrder) {
    const content = readFileSync(`${pathToDocsFolder}/docs/contributing/${file}`, 'utf8');

    fileToHeader.set(file, getFirstHeaderLink(content));
    fileToContent.set(file, content);
  }

  let actualSections = '';

  for (const file of filesInOrder) {
    let sectionContent = fileToContent.get(file);
    sectionContent = incrementHeaders(sectionContent);

    actualSections += sectionContent + '\n';
  }

  for (const referencedFile of filesInOrder) {
    actualSections = actualSections.replaceAll(referencedFile + '#', '#');

    const header = fileToHeader.get(referencedFile)!;
    actualSections = actualSections.replaceAll(referencedFile, header);
  }


  actualSections = actualSections.replaceAll('https://github.com/platers/obsidian-linter/blob/master/', '');

  const contributing = autogen_warning + contributing_template + actualSections;
  writeFileSync('CONTRIBUTING.md', contributing);
  console.log('CONTRIBUTING.md updated');
}

function incrementHeaders(markdown: string) {
  return markdown.replace(/^(#{1,5})(\s+)/gm, '$1#$2');
}

function getFirstHeaderLink(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  if (!match) {
    return '';
  }

  return (
    '#' +
    match[1]
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // remove punctuation
      .replace(/\s+/g, '-')     // spaces -> dashes
  );
}
