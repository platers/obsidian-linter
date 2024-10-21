import TestLinterPlugin, {IntegrationTestCase} from './main.test';
import {Editor, TFile} from 'obsidian';
import moment from 'moment';

function addBlankLineAfterSetup(plugin: TestLinterPlugin, _: Editor): Promise<void> {
  plugin.plugin.settings.ruleConfigs['add-blank-line-after-yaml'] = {
    'enabled': true,
  };

  return;
}

function addBlankLineAfterYAMLConflictWithYAMLTimestampInsert(plugin: TestLinterPlugin): Promise<void> {
  plugin.plugin.settings.ruleConfigs['add-blank-line-after-yaml'] = {
    'enabled': true,
  };
  plugin.plugin.settings.ruleConfigs['yaml-timestamp'] = {
    'enabled': true,
    'date-created': true,
    'date-created-key': 'created',
    'date-created-source-of-truth': 'file system',
    'date-modified': true,
    'date-modified-key': 'last_modified',
    'format': 'YYYY-MM-DD',
  };

  return;
}

function addBlankLineAfterYAMLConflictWithYAMLTimestampInsertExpectedTextModifications(text: string, file: TFile):string {
  text = text.replace('{{created_date}}', moment(file.stat.ctime ?? '').format('YYYY-MM-DD'));
  text = text.replace('{{modified_date}}', moment().format('YYYY-MM-DD'));

  return text;
}

function addBlankLineAfterYAMLConflictWithYAMLTimestampUpdate(plugin: TestLinterPlugin): Promise<void> {
  plugin.plugin.settings.ruleConfigs['add-blank-line-after-yaml'] = {
    'enabled': true,
  };
  plugin.plugin.settings.ruleConfigs['yaml-timestamp'] = {
    'enabled': true,
    'date-created': false,
    'date-modified': true,
    'date-modified-key': 'last_modified',
    'date-modified-source-of-truth': 'user or Linter edits',
    'format': 'YYYY-MM-DD',
  };

  return;
}

function addBlankLineAfterYAMLConflictWithYAMLTimestampUpdateExpectedTextModifications(text: string):string {
  text = text.replace('{{modified_date}}', moment().format('YYYY-MM-DD'));

  return text;
}


export const obsidianYAMLRuleTestCases: IntegrationTestCase[] = [
  {
    name: 'Updating a file with no yaml for adding blank lines after yaml should do nothing',
    filePath: 'yaml-rules/add-blank-line-after-yaml/no-yaml.md',
    setup: addBlankLineAfterSetup,
  },
  {
    name: 'Updating a file with yaml and no blanks for adding blank lines after yaml should get updated',
    filePath: 'yaml-rules/add-blank-line-after-yaml/yaml.md',
    setup: addBlankLineAfterSetup,
  },
  {
    name: 'Updating a file with no yaml where YAML Timestamp Adds a Date Created, should properly update the YAML with a blank line after the frontmatter',
    filePath: 'yaml-rules/add-blank-line-after-yaml/no-yaml-timestamp-addition.md',
    setup: addBlankLineAfterYAMLConflictWithYAMLTimestampInsert,
    modifyExpected: addBlankLineAfterYAMLConflictWithYAMLTimestampInsertExpectedTextModifications,
  },
  {
    name: 'Updating a file with yaml where YAML Timestamp will only be updated if a change is made to the file, should properly add the missing blank line and update the date modified timestamp',
    filePath: 'yaml-rules/add-blank-line-after-yaml/yaml-timestamp-update.md',
    setup: addBlankLineAfterYAMLConflictWithYAMLTimestampUpdate,
    modifyExpected: addBlankLineAfterYAMLConflictWithYAMLTimestampUpdateExpectedTextModifications,
  },
];
