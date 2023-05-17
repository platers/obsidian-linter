import dedent from 'ts-dedent';
import {getDisabledRules, rules} from '../src/rules';

type disabledRulesTestCase = {
  name: string,
  text: string,
  expectedDisabledRules: string[],
};

const disabledRulesTestCases: disabledRulesTestCase[] = [
  {
    name: 'when there is no YAML, no rules are disabled',
    text: dedent`
      Text
    `,
    expectedDisabledRules: [],
  },
  {
    name: 'when there is no YAML key for disabled rules, no rules are disabled',
    text: dedent`
      ---
      ---
      Text
    `,
    expectedDisabledRules: [],
  },
  {
    name: 'when there is no value in YAML key for disabled rules, no rules are disabled',
    text: dedent`
      ---
      disabled rules:
      ---
      Text
    `,
    expectedDisabledRules: [],
  },
  {
    name: 'when there is one value in YAML key for disabled rules, that one rules is disabled',
    text: dedent`
      ---
      disabled rules: [ yaml-timestamp ]
      ---
      Text
    `,
    expectedDisabledRules: ['yaml-timestamp'],
  },
  {
    name: 'when there is more than one value in YAML key for disabled rules, those rules are disabled',
    text: dedent`
      ---
      disabled rules: [ yaml-timestamp, capitalize-headings ]
      ---
      Text
    `,
    expectedDisabledRules: ['yaml-timestamp', 'capitalize-headings'],
  },
  {
    name: 'when the value in YAML key for disabled rules is "all", all rules are disabled',
    text: dedent`
      ---
      disabled rules: all
      ---
      Text
    `,
    expectedDisabledRules: rules.map((r) => r.alias),
  },
  {
    name: 'when the YAML is malformed, no error occurs trying to get disabled rules',
    text: dedent`
      ---
      tfratfrat
      ${''}
      ${''}
      ---
    `,
    expectedDisabledRules: [],
  },
];

describe('Disabled rules parsing', () => {
  for (const testCase of disabledRulesTestCases) {
    it(testCase.name, () => {
      const disabledRules = getDisabledRules(testCase.text);

      expect(disabledRules).toEqual(testCase.expectedDisabledRules);
    });
  }
});
