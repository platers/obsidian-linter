import RemoveEmptyListMarkers from '../src/rules/remove-empty-list-markers';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: RemoveEmptyListMarkers,
  testCases: [
    {
      testName: 'Remove empty list markers that do not have a new line after them',
      before: dedent`
        * Some list item 1
        *
      `,
      after: dedent`
        * Some list item 1
      `,
    },
    {
      testName: 'Remove empty list markers that are the only line in the file',
      before: dedent`
        *
      `,
      after: dedent`
        ${''}
      `,
    },
    {
      testName: 'Don\'t remove number if it is the only content of the line',
      before: dedent`
        42
      `,
      after: dedent`
        42
      `,
    },
    {
      testName: 'Don\'t remove number if not followed by `.` or `)`',
      before: dedent`
        42z
      `,
      after: dedent`
        42z
      `,
    },
    {
      testName: 'Remove number followed by `.`',
      before: dedent`
        42.
      `,
      after: dedent`
        ${''}
      `,
    },
    {
      testName: 'Remove number followed by `)`',
      before: dedent`
        42)
      `,
      after: dedent`
        ${''}
      `,
    },
  ],
});
