import dedent from 'ts-dedent';
import {getDisabledRules, rules} from '../src/rules';

type disabledRulesTestCase = {
  name: string,
  text: string,
  expectedDisabledRules: string[],
  expectedSkipFileResult: boolean,
};

const disabledRulesTestCases: disabledRulesTestCase[] = [
  {
    name: 'when there is no YAML, no rules are disabled',
    text: dedent`
      Text
    `,
    expectedDisabledRules: [],
    expectedSkipFileResult: false,
  },
  {
    name: 'when there is no YAML key for disabled rules, no rules are disabled',
    text: dedent`
      ---
      ---
      Text
    `,
    expectedDisabledRules: [],
    expectedSkipFileResult: false,
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
    expectedSkipFileResult: false,
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
    expectedSkipFileResult: false,
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
    expectedSkipFileResult: false,
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
    expectedSkipFileResult: true,
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
    expectedSkipFileResult: false,
  },
];

describe('Disabled rules parsing', () => {
  for (const testCase of disabledRulesTestCases) {
    it(testCase.name, () => {
      const [disabledRules, shouldSkipFile] = getDisabledRules(testCase.text);

      expect(disabledRules).toEqual(testCase.expectedDisabledRules);
      expect(shouldSkipFile).toEqual(testCase.expectedSkipFileResult);
    });
  }
});
