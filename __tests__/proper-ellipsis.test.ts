import dedent from 'ts-dedent';
import {ruleTest} from './common';
import ProperEllipsis from '../src/rules/proper-ellipsis';

ruleTest({
  RuleBuilderClass: ProperEllipsis,
  testCases: [
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
