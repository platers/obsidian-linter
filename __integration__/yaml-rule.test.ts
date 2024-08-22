import dedent from 'ts-dedent';
import TestLinterPlugin, {IntegrationTestCase} from './main.test';
import {Editor} from 'obsidian';
import expect from 'expect';

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
    assertions: (editor: Editor) =>{
      expect(editor.getValue()).toBe(dedent`
        This is a file with no YAML in it.
        It remains the same, right?
        ${''}
      `);
    },
  },
  {
    name: 'Updating a file with yaml and no blanks for adding blank lines after yaml should get updated',
    filePath: 'yaml-rules/add-blank-line-after-yaml/yaml.md',
    setup: addBlankLineAfterSetup,
    assertions: (editor: Editor) =>{
      expect(editor.getValue()).toBe(dedent`
        ---
        key: value
        ---
        ${''}
        No blank
        ${''}
      `);
    },
  },
];
