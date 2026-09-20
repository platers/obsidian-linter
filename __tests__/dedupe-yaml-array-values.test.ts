import DedupeYamlArrayValues from '../src/rules/dedupe-yaml-array-values';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: DedupeYamlArrayValues,
  testCases: [
    { // accounts for https://github.com/platers/obsidian-linter/issues/1385
      testName: 'Deduping escaped YAML array keys should not throw an error',
      before: dedent`
        ---
        "key1": 
          - value
        'key2': 
          - value
        ---
      `,
      after: dedent`
        ---
        "key1":
          - value
        'key2':
          - value
        ---
      `,
    },
  ],
});
