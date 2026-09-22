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
     { // accounts for https://github.com/platers/obsidian-linter/issues/1217
      testName: 'Deduping YAML arrays should properly handle escaped values being the same and prefer the first of all values that are found to be the same',
      before: dedent`
        ---
        key: [a, "a", 'a']
        key2: ["blob,bob, sally", 'blob,bob, sally']
        ---
      `,
      after: dedent`
        ---
        key: [a]
        key2: ["blob,bob, sally"]
        ---
      `,
    },
  ],
});
