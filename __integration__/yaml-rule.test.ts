import TestLinterPlugin, {IntegrationTestCase} from './main.test';
import {Editor} from 'obsidian';

function addBlankLineAfterSetup(plugin: TestLinterPlugin, _editor: Editor) {
  plugin.plugin.settings.ruleConfigs['add-blank-line-after-yaml'] = {
    'enabled': true,
  };
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
];
