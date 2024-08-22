import TestLinterPlugin, {IntegrationTestCase} from './main.test';
import {Editor} from 'obsidian';

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
  },
];
