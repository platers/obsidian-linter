import TwoSpacesBetweenLinesWithContent from '../rules/two-spaces-between-lines-with-content';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: TwoSpacesBetweenLinesWithContent,
  testCases: [
    {
      testName: 'Make sure obsidian multiline comments are not affected',
      before: dedent`
        Here is some inline comments: %%You can't see this text%% (Can't see it)

        Here is a block comment:
        %%
        It can span
        multiple lines
        %%
      `,
      after: dedent`
        Here is some inline comments: %%You can't see this text%% (Can't see it)

        Here is a block comment:  
        %%
        It can span
        multiple lines
        %%
      `,
    },
  ],
});
