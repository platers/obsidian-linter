import AddBlankLineAfterYAML from '../src/rules/add-blank-line-after-yaml';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: AddBlankLineAfterYAML,
  testCases: [
    {
      testName: 'Make sure that no YAML means no change to the text',
      before: dedent`
        Here is some text.
      `,
      after: dedent`
        Here is some text.
      `,
    },
    {
      testName: 'If there are multiple blank lines after a YAML block, they are left alone',
      before: dedent`
        ---
        key: value
        ---
        ${''}
        ${''}
        Content here.
      `,
      after: dedent`
        ---
        key: value
        ---
        ${''}
        ${''}
        Content here.
      `,
    },
    {
      testName: 'If there are multiple blank lines after a YAML block and they end the file content, they should be left alone',
      before: dedent`
        ---
        key: value
        ---
        ${''}
        ${''}
      `,
      after: dedent`
        ---
        key: value
        ---
        ${''}
        ${''}
      `,
    },
  ],
});
