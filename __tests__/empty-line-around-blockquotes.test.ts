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
        >
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
  ],
});
