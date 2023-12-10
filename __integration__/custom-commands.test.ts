import dedent from 'ts-dedent';
import TestLinterPlugin, {IntegrationTestCase} from './main.test';
import {Editor} from 'obsidian';
import expect from 'expect';

export const customCommandTestCases: IntegrationTestCase[] = [
  {
    name: 'Advanced Tables custom command running after the linting of a file should run just fine even though it relies on the cache',
    filePath: 'custom-commands/table-format.md',
    async setup(plugin: TestLinterPlugin, _: Editor) {
      plugin.plugin.settings.ruleConfigs['consecutive-blank-lines'] = {
        'enabled': true,
      };

      plugin.plugin.settings.lintCommands = [{
        'id': 'table-editor-obsidian:format-all-tables',
        'name': 'Format all tables in this file',
      }];
    },
    async assertions(editor: Editor) {
      expect(editor.getValue()).toBe(dedent`
        | one   | two | three | four          |
        | ----- | --- | ----- | ------------- |
        | 1     | ✓   |       |               |
        | 2     |     | ✓     |               |
        | 3     |     | ✓     | ✓             |
        | 4     | …   |       | someting else |
        | Total | 100 | 20    | 300000000     |
        ${''}
        | one   | two | three | four          |
        | ----- | --- | ----- | ------------- |
        | 1     | ✓   |       |               |
        | 2     |     | ✓     |               |
        | 3     |     | ✓     | ✓             |
        | 4     | …   |       | someting else |
        | Total | 100 | 20    | 300000000     |
        ${''}
        | one   | two | three | four          |
        | ----- | --- | ----- | ------------- |
        | 1     | ✓   |       |               |
        | 2     |     | ✓     |               |
        | 3     |     | ✓     | ✓             |
        | 4     | …   |       | someting else |
        | Total | 100 | 20    | 300000000     |
        ${''}
      `);
    },
  },
];
