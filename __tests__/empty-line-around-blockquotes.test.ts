import EmptyLineAroundBlockquotes from '../src/rules/empty-line-around-blockquotes';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: EmptyLineAroundBlockquotes,
  testCases: [
    { // accounts for https://github.com/platers/obsidian-linter/issues/668
      testName: 'Make sure that consecutive blockquotes are not merged when a blank line is between them',
      before: dedent`
        > [!quote] Title 1
        > The quote 1
        ${''}
        > [!quote] Title 2
        > The quote 2
      `,
      after: dedent`
        > [!quote] Title 1
        > The quote 1
        ${''}
        > [!quote] Title 2
        > The quote 2
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/668
      testName: 'Make sure that consecutive blockquotes are not merged when multiple blank lines are between them',
      before: dedent`
        > [!quote] title 1
        > the quote 1
        ${''}
        ${''}
        > [!quote] title 2
        > the quote 2
      `,
      after: dedent`
        > [!quote] title 1
        > the quote 1
        ${''}
        > [!quote] title 2
        > the quote 2
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/668
      testName: 'Make sure that consecutive blockquotes are not merged when a blank line is between them',
      before: dedent`
        > [!quote] Title 1
        > The quote 1
        ${''}
        > [!quote] Title 2
        > The quote 2
        ${''}
        > [!quote] Title 3
        > The quote 3
      `,
      after: dedent`
        > [!quote] Title 1
        > The quote 1
        ${''}
        > [!quote] Title 2
        > The quote 2
        ${''}
        > [!quote] Title 3
        > The quote 3
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/668
      testName: 'Make sure that consecutive blockquotes are not merged when multiple blank lines are between them',
      before: dedent`
        > [!quote] Title 1
        > The quote 1
        ${''}
        ${''}
        > [!quote] Title 2
        > The quote 2
        ${''}
        ${''}
        ${''}
        ${''}
        > [!quote] Title 3
        > The quote 3
      `,
      after: dedent`
        > [!quote] Title 1
        > The quote 1
        ${''}
        > [!quote] Title 2
        > The quote 2
        ${''}
        > [!quote] Title 3
        > The quote 3
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/684
      testName: 'Make sure that consecutive blockquotes ends with empty blockquote line',
      before: dedent`
> [!FAQ] Title
> 
${''}
> [!NOTES] Title
> Content
`,
      after: dedent`
> [!FAQ] Title
> 

> [!NOTES] Title
> Content
    `,
    },
  ],
});
