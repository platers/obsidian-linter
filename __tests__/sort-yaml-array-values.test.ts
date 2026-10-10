import SortYamlArrayValues from '../src/rules/sort-yaml-array-values';
import dedent from 'ts-dedent';
import { ruleTest } from './common';
import { ArrayFormats } from '../src/utils/yaml';

ruleTest({
  RuleBuilderClass: SortYamlArrayValues,
  testCases: [
    { // accounts for https://github.com/platers/obsidian-linter/issues/1024
      testName: 'Sort YAML Arrays sorts values in a case-insensitive manner',
      before: dedent`
        ---
        tags:
          - tag/a
          - tag/B
          - tag/c
          - tag/D
        ---
      `,
      after: dedent`
        ---
        tags:
          - tag/a
          - tag/B
          - tag/c
          - tag/D
        ---
      `,
      options: {
        tagArrayStyle: ArrayFormats.MultiLine,
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1385
      testName: 'Sort YAML Arrays sorts values in a case-insensitive manner and retains the original key escaping',
      before: dedent`
        ---
        'tags':
          - tag/a
          - tag/B
          - tag/c
          - tag/D
        "key":
          - value
        ---
      `,
      after: dedent`
        ---
        'tags':
          - tag/a
          - tag/B
          - tag/c
          - tag/D
        "key":
          - value
        ---
      `,
      options: {
        tagArrayStyle: ArrayFormats.MultiLine,
      },
    },
  ],
});
