import dedent from 'ts-dedent';
import {getDisabledRules, rules} from '../src/rules';
import {moveDisabledRulesIntoLinterNamespace, moveOldLinterKeysIntoLinterNamespace} from '../src/utils/yaml';

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
    name: 'when the disabled rules are under the linter key, those rules are disabled',
    text: dedent`
      ---
      linter:
        disabled-rules: [ yaml-timestamp, capitalize-headings ]
      ---
      Text
    `,
    expectedDisabledRules: ['yaml-timestamp', 'capitalize-headings'],
    expectedSkipFileResult: false,
  },
  {
    name: 'when the disabled rules under the linter key are a multi-line array, those rules are disabled',
    text: dedent`
      ---
      linter:
        disabled-rules:
          - yaml-timestamp
          - capitalize-headings
      ---
      Text
    `,
    expectedDisabledRules: ['yaml-timestamp', 'capitalize-headings'],
    expectedSkipFileResult: false,
  },
  {
    name: 'when the value under the linter key is "all", all rules are disabled',
    text: dedent`
      ---
      linter:
        disabled-rules: all
      ---
      Text
    `,
    expectedDisabledRules: rules.map((r) => r.alias),
    expectedSkipFileResult: true,
  },
  {
    name: 'when both the old key and the linter key have disabled rules, the rules from both are disabled',
    text: dedent`
      ---
      disabled rules: [ capitalize-headings, header-increment ]
      linter:
        disabled-rules: [ yaml-timestamp, capitalize-headings ]
      ---
      Text
    `,
    expectedDisabledRules: ['yaml-timestamp', 'capitalize-headings', 'header-increment'],
    expectedSkipFileResult: false,
  },
  {
    name: 'when a disabled rules key is nested under some other key, it does not disable any rules',
    text: dedent`
      ---
      other:
        disabled-rules: [ yaml-timestamp ]
        disabled rules: [ yaml-timestamp ]
      ---
      Text
    `,
    expectedDisabledRules: [],
    expectedSkipFileResult: false,
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

type disabledRulesMigrationTestCase = {
  name: string,
  before: string,
  after: string,
};

const disabledRulesMigrationTestCases: disabledRulesMigrationTestCase[] = [
  {
    name: 'when there is no YAML, nothing changes',
    before: dedent`
      Text
    `,
    after: dedent`
      Text
    `,
  },
  {
    name: 'when there is no old key, nothing changes',
    before: dedent`
      ---
      linter:
        disabled-rules: [yaml-timestamp]
      ---
      Text
    `,
    after: dedent`
      ---
      linter:
        disabled-rules: [yaml-timestamp]
      ---
      Text
    `,
  },
  {
    name: 'a single-line array is moved under the linter key',
    before: dedent`
      ---
      title: Title
      disabled rules: [yaml-timestamp, capitalize-headings]
      tags: [tag1]
      ---
      Text
    `,
    after: dedent`
      ---
      title: Title
      tags: [tag1]
      linter:
        disabled-rules: [yaml-timestamp, capitalize-headings]
      ---
      Text
    `,
  },
  {
    name: 'a multi-line array is moved under the linter key with its items indented',
    before: dedent`
      ---
      disabled rules:
        - yaml-timestamp
        - capitalize-headings
      ---
      Text
    `,
    after: dedent`
      ---
      linter:
        disabled-rules:
          - yaml-timestamp
          - capitalize-headings
      ---
      Text
    `,
  },
  {
    name: 'a single string is moved under the linter key',
    before: dedent`
      ---
      disabled rules: all
      ---
      Text
    `,
    after: dedent`
      ---
      linter:
        disabled-rules: all
      ---
      Text
    `,
  },
  {
    name: 'the old key is added to an existing linter key that has other keys',
    before: dedent`
      ---
      disabled rules: [yaml-timestamp]
      linter:
        yaml-title-alias: Title
      ---
      Text
    `,
    after: dedent`
      ---
      linter:
        yaml-title-alias: Title
        disabled-rules: [yaml-timestamp]
      ---
      Text
    `,
  },
  {
    name: 'when both keys are present, their values are merged under the linter key',
    before: dedent`
      ---
      disabled rules: [capitalize-headings, header-increment]
      linter:
        disabled-rules:
          - yaml-timestamp
          - capitalize-headings
      ---
      Text
    `,
    after: dedent`
      ---
      linter:
        disabled-rules: [yaml-timestamp, capitalize-headings, header-increment]
      ---
      Text
    `,
  },
  {
    name: 'when linter has a scalar value, the old key stays where it is',
    before: dedent`
      ---
      linter: something
      disabled rules: [yaml-timestamp]
      ---
      Text
    `,
    after: dedent`
      ---
      linter: something
      disabled rules: [yaml-timestamp]
      ---
      Text
    `,
  },
];

describe('Disabled rules migration', () => {
  for (const testCase of disabledRulesMigrationTestCases) {
    it(testCase.name, () => {
      expect(moveDisabledRulesIntoLinterNamespace(testCase.before)).toEqual(testCase.after);
    });
  }
});

const oldLinterKeysMigrationTestCases: disabledRulesMigrationTestCase[] = [
  {
    name: 'when there are no old keys, nothing changes',
    before: dedent`
      ---
      linter:
        yaml-title-alias: Title
        disabled-rules: [yaml-timestamp]
      tags: [a]
      ---
      Text
    `,
    after: dedent`
      ---
      linter:
        yaml-title-alias: Title
        disabled-rules: [yaml-timestamp]
      tags: [a]
      ---
      Text
    `,
  },
  {
    name: 'both old keys are moved under linter and other keys are left alone',
    before: dedent`
      ---
      aliases:
        - Title
      linter-yaml-title-alias: Title
      disabled rules: [capitalize-headings]
      tags: [a]
      ---
      Text
    `,
    after: dedent`
      ---
      aliases:
        - Title
      tags: [a]
      linter:
        disabled-rules: [capitalize-headings]
        yaml-title-alias: Title
      ---
      Text
    `,
  },
  {
    name: 'a file with all rules disabled is migrated too',
    before: dedent`
      ---
      disabled rules: [all]
      ---
      Text
    `,
    after: dedent`
      ---
      linter:
        disabled-rules: [all]
      ---
      Text
    `,
  },
  {
    name: 'when the namespaced title alias helper key is present, it wins and the old key is dropped',
    before: dedent`
      ---
      linter-yaml-title-alias: Old Title
      linter:
        yaml-title-alias: New Title
      ---
      Text
    `,
    after: dedent`
      ---
      linter:
        yaml-title-alias: New Title
      ---
      Text
    `,
  },
  {
    name: 'when linter has a flow map value, the old keys stay where they are',
    before: dedent`
      ---
      linter: {other: 1}
      linter-yaml-title-alias: Title
      ---
      Text
    `,
    after: dedent`
      ---
      linter: {other: 1}
      linter-yaml-title-alias: Title
      ---
      Text
    `,
  },
];

describe('Old Linter keys migration', () => {
  for (const testCase of oldLinterKeysMigrationTestCases) {
    it(testCase.name, () => {
      expect(moveOldLinterKeysIntoLinterNamespace(testCase.before)).toEqual(testCase.after);
    });
  }
});
