import YamlTitle from '../src/rules/yaml-title';
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
    {
      testName: 'Escaping with single quotes works',
      before: dedent`
        # This is a title
      `,
      after: dedent`
        ---
        title: 'This is a title'
        ---
        # This is a title
      `,
      options: {
        fileName: 'testFile',
        yamlEscapeCharacter: 'Single Quote',
      },
    },
    {
      testName: 'Escaping with double quotes works',
      before: dedent`
        # This is a title
      `,
      after: dedent`
        ---
        title: "This is a title"
        ---
        # This is a title
      `,
      options: {
        fileName: 'testFile',
        yamlEscapeCharacter: 'Double Quote',
      },
    },
    {
      testName: 'Escaping with double quotes does not come into affect when already escaped with single quotes',
      before: dedent`
        # "This is a title
      `,
      after: dedent`
        ---
        title: '"This is a title'
        ---
        # "This is a title
      `,
      options: {
        fileName: 'testFile',
        yamlEscapeCharacter: 'Double Quote',
      },
    },
  ],
});
