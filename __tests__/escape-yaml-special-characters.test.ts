import dedent from 'ts-dedent';
import {ruleTest} from './common';
import EscapeYamlSpecialCharacters from '../src/rules/escape-yaml-special-characters';

ruleTest({
  RuleBuilderClass: EscapeYamlSpecialCharacters,
  testCases: [
    { // accounts for https://github.com/platers/obsidian-linter/issues/467
      testName: 'Make sure that dictionaries in a multiline array do not accidentally get escaped',
      before: dedent`
        ---
        gists:
          - id: testing123
            url: 'https://gist.github.com/testing123'
            createdAt: '2022-11-01T16:07:48Z'
            updatedAt: '2022-11-01T16:35:11Z'
            filename: file1.md
            isPublic: true
        ---
      `,
      after: dedent`
        ---
        gists:
          - id: testing123
            url: 'https://gist.github.com/testing123'
            createdAt: '2022-11-01T16:07:48Z'
            updatedAt: '2022-11-01T16:35:11Z'
            filename: file1.md
            isPublic: true
        ---
      `,
    },
    {
      testName: 'Make sure that a multiline array with a key value pair in it gets escaped if there are no subsequent key value pairs at the same indentation level',
      before: dedent`
        ---
        gists:
          - id: testing123
        url: 'https://gist.github.com/testing123'
        ---
      `,
      after: dedent`
        ---
        gists:
          - "id: testing123"
        url: 'https://gist.github.com/testing123'
        ---
      `,
    },
    {
      testName: 'Make sure that a multiline array with a key value pair in it gets escaped if and does not throw an error if there are no further lines after it',
      before: dedent`
        ---
        gists:
          - id: testing123
        ---
      `,
      after: dedent`
        ---
        gists:
          - "id: testing123"
        ---
      `,
    },
  ],
});
