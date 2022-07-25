import SpaceAfterListMarkers from '../rules/space-after-list-markers';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: SpaceAfterListMarkers,
  testCases: [
    {
      testName: 'Handles empty bullets',
      before: dedent`
        Line
        - 1
        - ${''}
        Line
      `,
      after: dedent`
        Line
        - 1
        - ${''}
        Line
      `,
    },
  ],
});
