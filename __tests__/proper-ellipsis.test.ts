import dedent from 'ts-dedent';
import {ruleTest} from './common';
import ProperEllipsis from '../src/rules/proper-ellipsis';

ruleTest({
  RuleBuilderClass: ProperEllipsis,
  testCases: [
    {
      testName: 'Leaves ellipses inside fenced code alone',
      before: '```\n... . . .\n```\n...',
      after: '```\n... . . .\n```\n…',
    },
    {
      testName: 'Leaves ellipses inside disabled sections alone',
      before: '<!-- linter-disable -->\n... . . .\n<!-- linter-enable -->\n...',
      after: '<!-- linter-disable -->\n... . . .\n<!-- linter-enable -->\n…',
    },
    {
      testName: 'Replaces triples and their internal spaces, preserving leftover dots and spaces',
      before: '.... ..... ...... . . . . . . .',
      after: '……… …… … … .',
    },
    {
      testName: 'Converts dots adjacent to protected links without touching their dots',
      before: '...[a...b](url)...',
      after: '…[a...b](url)…',
    },
    {
      testName: 'Does not modify embedded links',
      before: dedent`
        ![title](a...b.md)
        ![](c...d.png)
      `,
      after: dedent`
        ![title](a...b.md)
        ![](c...d.png)
      `,
    },
  ],
});
