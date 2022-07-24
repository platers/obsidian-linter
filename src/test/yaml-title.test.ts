import YamlTitle from '../rules/yaml-title';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: YamlTitle,
  testCases: [
    {
      testName: 'Keeps unescaped title if possible',
      before: dedent`
        # Hello world
      `,
      after: dedent`
        ---
        title: Hello world
        ---
        # Hello world
      `,
    },
    {
      testName: 'Escapes title if it contains colon',
      before: dedent`
        # Hello: world
      `,
      after: dedent`
        ---
        title: 'Hello: world'
        ---
        # Hello: world
      `,
    },
    {
      testName: 'Escapes title if it starts with single quote',
      before: dedent`
        # 'Hello world
      `,
      after: dedent`
        ---
        title: '''Hello world'
        ---
        # 'Hello world
      `,
    },
    {
      testName: 'Escapes title if it starts with double quote',
      before: dedent`
        # "Hello world
      `,
      after: dedent`
        ---
        title: '"Hello world'
        ---
        # "Hello world
      `,
    },
    {
      testName: 'Does not insert line breaks for long title',
      before: dedent`
        # Very long title 1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
      `,
      after: dedent`
        ---
        title: Very long title 1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
        ---
        # Very long title 1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
      `,
    },
  ],
});
