import RemoveEmptyListMarkers from '../src/rules/remove-empty-list-markers';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: RemoveEmptyListMarkers,
  testCases: [
    {
      testName: 'Leaves empty markers inside fenced code alone',
      before: '```\n-\n- [ ]\n```\n-\noutside',
      after: '```\n-\n- [ ]\n```\noutside',
    },
    {
      testName: 'Leaves empty markers inside disabled sections alone',
      before: '<!-- linter-disable -->\n-\n- [ ]\n<!-- linter-enable -->\n-\noutside',
      after: '<!-- linter-disable -->\n-\n- [ ]\n<!-- linter-enable -->\noutside',
    },
    {
      // The source regex consumes the protected indented-code line as a blockquote prefix.
      // Masking hides that prefix and still removes the final marker; a whole-match guard cannot.
      testName: 'Preserves masking behavior after indented code ending in a quote marker',
      before: '    >\n-',
      after: '    >',
    },
    {
      testName: 'The trailing-marker pass sees the line break left by earlier removals',
      before: 'text\n-\n-',
      after: 'text',
    },
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
