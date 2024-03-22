import TwoSpacesBetweenLinesWithContent from '../src/rules/two-spaces-between-lines-with-content';
import dedent from 'ts-dedent';
import {ruleTest} from './common';
import {LineBreakIndicators} from '../src/utils/mdast';

ruleTest({
  RuleBuilderClass: TwoSpacesBetweenLinesWithContent,
  testCases: [
    {
      testName: 'Make sure obsidian multiline comments are not affected',
      before: dedent`
        Here is some inline comments: %%You can't see this text%% (Can't see it)
        ${''}
        Here is a block comment:
        %%
        It can span
        multiple lines
        %%
      `,
      after: dedent`
        Here is some inline comments: %%You can't see this text%% (Can't see it)
        ${''}
        Here is a block comment:  ${''}
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
        ${''}
        ## R
        ${''}
        %%
        HW:: --
        T:: 0
        %%
        ${''}
        # A %% fold %%
        ${''}
        ## R
        ${''}
        %%
        HW:: --
        T:: 0
        %%
        ${''}
        # A %% fold %% nocomment
        ${''}
        ## R
        ${''}
        %%
        HW:: --
        T:: 0
        %%
      `,
      after: dedent`
        %% fold %%
        ${''}
        ## R
        ${''}
        %%
        HW:: --
        T:: 0
        %%
        ${''}
        # A %% fold %%
        ${''}
        ## R
        ${''}
        %%
        HW:: --
        T:: 0
        %%
        ${''}
        # A %% fold %% nocomment
        ${''}
        ## R
        ${''}
        %%
        HW:: --
        T:: 0
        %%
      `,
    },
    {
      testName: 'Make sure that using a line break indicator of `<br>` replaces the other line break endings properly',
      before: dedent`
        Here is some text${'  '}
        Here is some more text\\
        Here is yet some more text<br>
        Even more text<br/>
        Once more...
      `,
      after: dedent`
        Here is some text<br>
        Here is some more text<br>
        Here is yet some more text<br>
        Even more text<br>
        Once more...
      `,
      options: {
        lineBreakIndicator: LineBreakIndicators.LineBreakHtmlNotXml,
      },
    },
    {
      testName: 'Make sure that using a line break indicator of `<br/>` replaces the other line break endings properly',
      before: dedent`
        Here is some text${'  '}
        Here is some more text\\
        Here is yet some more text<br>
        Even more text<br/>
        Once more...
      `,
      after: dedent`
        Here is some text<br/>
        Here is some more text<br/>
        Here is yet some more text<br/>
        Even more text<br/>
        Once more...
      `,
      options: {
        lineBreakIndicator: LineBreakIndicators.LineBreakHtml,
      },
    },
    {
      testName: 'Make sure that using a line break indicator of `\\` replaces the other line break endings properly',
      before: dedent`
        Here is some text${'  '}
        Here is some more text\\
        Here is yet some more text<br>
        Even more text<br/>
        Once more...
      `,
      after: dedent`
        Here is some text\\
        Here is some more text\\
        Here is yet some more text\\
        Even more text\\
        Once more...
      `,
      options: {
        lineBreakIndicator: LineBreakIndicators.Backslash,
      },
    },
    {
      testName: 'Make sure that using a line break indicator of `  ` replaces the other line break endings properly',
      before: dedent`
        Here is some text${'  '}
        Here is some more text\\
        Here is yet some more text<br>
        Even more text<br/>
        Once more...
      `,
      after: dedent`
        Here is some text${'  '}
        Here is some more text${'  '}
        Here is yet some more text${'  '}
        Even more text${'  '}
        Once more...
      `,
      options: {
        lineBreakIndicator: LineBreakIndicators.TwoSpaces,
      },
    },
  ],
});
