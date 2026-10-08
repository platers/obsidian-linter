import TestLinterPlugin, { IntegrationTestCase } from './main.test';

function disableSetup(plugin: TestLinterPlugin): Promise<void> {
  plugin.plugin.settings.ruleConfigs['consecutive-blank-lines'] = {
    'enabled': true,
  };

  plugin.plugin.settings.ruleConfigs['line-break-at-document-end'] = {
    'enabled': true,
  };

  return;
}

export const disabledRulesTestCases: IntegrationTestCase[] = [
  {
    name: 'Ignoring all tests should make it so that no lint rules run',
    filePath: 'disabled-rules/disable-all.md',
    setup: disableSetup,
  },
  {
    name: 'If a rule is disabled, it should not run and affect the content of the file where it is disabled',
    filePath: 'disabled-rules/disable-single-rule.md',
    setup: disableSetup,
  },
];
