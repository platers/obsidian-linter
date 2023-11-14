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
      testName: 'Make sure that consecutive blockquotes do not get merged when the first one ends with an empty blockquote line',
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
        ${''}
        > [!NOTES] Title
        > Content
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/684
      testName: 'Make sure that consecutive blockquotes do not get merged when the second one starts with an empty blockquote line',
      before: dedent`
        > [!FAQ] Title
        > Content here
        ${''}
        >
        > [!NOTES] Title
        > Content
      `,
      after: dedent`
        > [!FAQ] Title
        > Content here
        ${''}
        > [!NOTES] Title
        > Content
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/684
      testName: 'Make sure that a nested set of callouts are not merged when only a blank lines is between them with no content',
      before: dedent`
        > [!multi-column]
        >
        >> [!note]+ Use Case
        >> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        >> ##### User Case Background
        >> Vitae nunc sed velit dignissim sodales. In cursus turpis massa tincidunt dui ut ornare lectus.
        >
        >> [!warning]+ Resources
        >> #### Requirement
        >> - Lorem ipsum dolor sit amet
        >> - Vitae nunc sed velit dignissim sodales.
        >> - In cursus turpis massa tincidunt dui ut ornare lectus.
        >
        >> [!todo]+
        >> - [x] Define Use Case
        >> - [ ] Craft User Story
        >> - [ ] Develop draft sketches
      `,
      after: dedent`
        > [!multi-column]
        >
        >> [!note]+ Use Case
        >> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        >> ##### User Case Background
        >> Vitae nunc sed velit dignissim sodales. In cursus turpis massa tincidunt dui ut ornare lectus.
        >
        >> [!warning]+ Resources
        >> #### Requirement
        >> - Lorem ipsum dolor sit amet
        >> - Vitae nunc sed velit dignissim sodales.
        >> - In cursus turpis massa tincidunt dui ut ornare lectus.
        >
        >> [!todo]+
        >> - [x] Define Use Case
        >> - [ ] Craft User Story
        >> - [ ] Develop draft sketches
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/910
      testName: 'Make sure that the end of a blockqoute is properly identified when there is a blank line right after a blockqoute',
      before: dedent`
        ---
        date created: 29-10-2023 04:16 PM
        date modified: 12-11-2023 04:11 PM
        ---
        ${''}
        > 1
        >
        > > 2
        > >
        > > > 3
        ${''}
        > 4
        ${''}
      `,
      after: dedent`
        ---
        date created: 29-10-2023 04:16 PM
        date modified: 12-11-2023 04:11 PM
        ---
        ${''}
        > 1
        >
        > > 2
        > >
        > > > 3
        ${''}
        > 4
        ${''}
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/910
      testName: 'Make sure that a blockquote 1 level lower than the next one ends in an empty line that it is on its level',
      before: dedent`
        > 1
        >> 2
        >
        >>> 3
        ${''}
        > 4
      `,
      after: dedent`
        > 1
        >
        >> 2
        >>
        >>> 3
        ${''}
        > 4
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/910
      testName: 'Make sure that a blockquote that starts with an empty blockquote line gets the proper blockquote empty line set',
      before: dedent`
        > 1
        >> 2
        >>>
        >>> 3
        ${''}
        > 4
      `,
      after: dedent`
        > 1
        >
        >> 2
        >>
        >>> 3
        ${''}
        > 4
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/910
      testName: 'Make sure that a blockquote that ends in a blank blockquote line gets the proper blockquote empty line set',
      before: dedent`
        > 1
        >> 2
        >>
        >>> 3
        >>>
        >> 2
        ${''}
        > 4
      `,
      after: dedent`
        > 1
        >
        >> 2
        >>
        >>> 3
        >>
        >> 2
        ${''}
        > 4
      `,
    },
  ],
});
