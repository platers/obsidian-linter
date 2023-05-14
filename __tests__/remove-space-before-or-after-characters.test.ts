import RemoveSpaceBeforeOrAfterCharacters from '../src/rules/remove-space-before-or-after-characters';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: RemoveSpaceBeforeOrAfterCharacters,
  testCases: [
    {
      testName: 'Make sure that checklists completion indicator does not get affected by the rule',
      before: dedent`
        # Title
        ${''}
        - [ ] ]Task 1 starting with opening square brace keeps initial space
        - [ ] Task 2
        - [x] Task 3
        - [ ] Task 4 .
        ${''}
      `,
      after: dedent`
        # Title
        ${''}
        - [ ] ]Task 1 starting with opening square brace keeps initial space
        - [ ] Task 2
        - [x] Task 3
        - [ ] Task 4.
        ${''}
      `,
    },
    {
      testName: 'Make sure that checklists completion indicator does not get affected by the rule when there is a sublist',
      before: dedent`
        # Title
        ${''}
        - [ ] Task 1
          - [ ] Task 2
          - [x] Task 3 ,
        - [ ] Task 4 .
        ${''}
      `,
      after: dedent`
        # Title
        ${''}
        - [ ] Task 1
          - [ ] Task 2
          - [x] Task 3,
        - [ ] Task 4.
        ${''}
      `,
    },

  ],
});
