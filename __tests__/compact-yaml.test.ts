import CompactYaml from '../src/rules/compact-yaml';
import dedent from 'ts-dedent';
import { ruleTest } from './common';

ruleTest({
  RuleBuilderClass: CompactYaml,
  testCases: [
    { // accounts for https://github.com/platers/obsidian-linter/issues/1564
      testName: 'Compact YAML should ignore blank lines inside scalar blocks',
      before: dedent`
        ---
        overview: |-
          This is the System area. It holds the system's own infrastructure and governance.
        ${''}
          This vault holds only the System area at present.
        key:
          - Value
          - Value2
        ---
      `,
      after: dedent`
        ---
        overview: |-
          This is the System area. It holds the system's own infrastructure and governance.
        ${''}
          This vault holds only the System area at present.
        key:
          - Value
          - Value2
        ---
      `,
      options: {
        innerNewLines: true
      }
    },
  ],
});
