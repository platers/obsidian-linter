import RemoveLinkSpacing from '../rules/remove-link-spacing';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: RemoveLinkSpacing,
  testCases: [
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/236
      testName: 'Link after checkbox is not affected by removing whitespace in links',
      before: dedent`
        - [ ] [Link text](path/fileName.md)
        - [ ] [[fileName]]
      `,
      after: dedent`
        - [ ] [Link text](path/fileName.md)
        - [ ] [[fileName]]
      `,
    },
  ],
});
