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
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/300
      testName: 'Make sure obsidian multiline comments with single line comment prior is not affected',
      before: dedent`
        %% fold %%

        ## R

        %%
        HW:: --
        T:: 0
        %%

        # A %% fold %%

        ## R

        %%
        HW:: --
        T:: 0
        %%

        # A %% fold %% nocomment

        ## R

        %%
        HW:: --
        T:: 0
        %%
      `,
      after: dedent`
        %% fold %%

        ## R

        %%
        HW:: --
        T:: 0
        %%

        # A %% fold %%

        ## R

        %%
        HW:: --
        T:: 0
        %%

        # A %% fold %% nocomment

        ## R

        %%
        HW:: --
        T:: 0
        %%
      `,
    },
  ],
});
