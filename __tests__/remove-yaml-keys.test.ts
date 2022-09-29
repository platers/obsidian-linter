import RemoveYamlKeys from '../src/rules/remove-yaml-keys';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: RemoveYamlKeys,
  testCases: [
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/426
      testName: 'Make sure that removing keys only works on the entire key not just a part',
      before: dedent`
        ---
        type: 
        status: 
        tags: 
        aliases: 
        cssclass: 
        publish: false
        date created: 2022-09-27 18:41
        date modified: 2022-09-27 18:44
        ---
      `,
      after: dedent`
        ---
        type: 
        status: 
        tags: 
        aliases: 
        cssclass: 
        publish: false
        date created: 2022-09-27 18:41
        date modified: 2022-09-27 18:44
        ---
      `,
      options: {
        yamlKeysToRemove: ['created'],
      },
    },
  ],
});
