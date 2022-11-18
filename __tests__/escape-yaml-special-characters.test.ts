import dedent from 'ts-dedent';
import {ruleTest} from './common';
import EscapeYamlSpecialCharactersOptions from '../src/rules/escape-yaml-special-characters';

ruleTest({
  RuleBuilderClass: EscapeYamlSpecialCharactersOptions,
  testCases: [
    { // accounts for https://github.com/platers/obsidian-linter/issues/467
      testName: 'Make sure that dictionaries in a multiline array do not accidentally get escaped',
      before: dedent`
        ---
        gists:
          - id: 4d06d592f0b0ae1771c0012de3562d8d
            url: 'https://gist.github.com/4d06d592f0b0ae1771c0012de3562d8d'
            createdAt: '2022-11-01T16:07:48Z'
            updatedAt: '2022-11-01T16:35:11Z'
            filename: Stochastic P1.md
            isPublic: true
        ---
      `,
      after: dedent`
        ---
        gists:
          - id: 4d06d592f0b0ae1771c0012de3562d8d
            url: 'https://gist.github.com/4d06d592f0b0ae1771c0012de3562d8d'
            createdAt: '2022-11-01T16:07:48Z'
            updatedAt: '2022-11-01T16:35:11Z'
            filename: Stochastic P1.md
            isPublic: true
        ---
      `,
    },
    {
      testName: 'Make sure that a multiline array with a key value pair in it gets escaped if there are no subsequent key value pairs at the same indentation level',
      before: dedent`
        ---
        gists:
          - id: 4d06d592f0b0ae1771c0012de3562d8d
        url: 'https://gist.github.com/4d06d592f0b0ae1771c0012de3562d8d'
        ---
      `,
      after: dedent`
        ---
        gists:
          - "id: 4d06d592f0b0ae1771c0012de3562d8d"
        url: 'https://gist.github.com/4d06d592f0b0ae1771c0012de3562d8d'
        ---
      `,
    },
    {
      testName: 'Make sure that a multiline array with a key value pair in it gets escaped if and does not throw an error if there are no further lines after it',
      before: dedent`
        ---
        gists:
          - id: 4d06d592f0b0ae1771c0012de3562d8d
        ---
      `,
      after: dedent`
        ---
        gists:
          - "id: 4d06d592f0b0ae1771c0012de3562d8d"
        ---
      `,
    },
  ],
});
