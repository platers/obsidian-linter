import dedent from 'ts-dedent';
import {ruleTest} from './common';
import EmptyLineAroundTables from '../src/rules/empty-line-around-tables';

ruleTest({
  RuleBuilderClass: EmptyLineAroundTables,
  testCases: [
    {
      testName: 'Make sure multiple blank lines at the start and end are removed',
      before: dedent`
        ${''}
        ${''}
        | Column 1 | Column 2 |
        |----------|----------|
        | foo      | bar      |
        | baz      | qux      |
        | quux     | quuz     |
        ${''}
        ${''}
      `,
      after: dedent`
        | Column 1 | Column 2 |
        |----------|----------|
        | foo      | bar      |
        | baz      | qux      |
        | quux     | quuz     |
      `,
    },
    {
      testName: 'Make sure multiple blank lines at the start and end are removed when dealing with blockquotes or callouts',
      before: dedent`
        >
        > ${''}
        > | Column 1 | Column 2 |
        > |----------|----------|
        > | foo      | bar      |
        > | baz      | qux      |
        > | quux     | quuz     |
        > ${''}
        >
      `,
      after: dedent`
        > | Column 1 | Column 2 |
        > |----------|----------|
        > | foo      | bar      |
        > | baz      | qux      |
        > | quux     | quuz     |
      `,
    },
    {
      testName: 'Don\'t modify inline math',
      before: dedent`
        ${''}
        $|a| + |b|$
      `,
      after: dedent`
        ${''}
        $|a| + |b|$
      `,
    },
    {
      testName: 'Don\'t modify math',
      before: dedent`
        ${''}
        $$
        |a| + |b|
        $$
      `,
      after: dedent`
        ${''}
        $$
        |a| + |b|
        $$
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/559
      testName: 'Make sure that consecutive links are not affected',
      before: dedent`
        [[filename with dot . |alt name]] [[filename|alt name]]
        ${''}
      `,
      after: dedent`
        [[filename with dot . |alt name]] [[filename|alt name]]
        ${''}
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/559
      testName: 'More complex link scenario is not affected either',
      before: dedent`
        dolor sit amet [[filename with dot . |alt name]] lorem ipsum [[filename|alt name]] adipisci velit [[filename|alt name]]
        ${''}
      `,
      after: dedent`
        dolor sit amet [[filename with dot . |alt name]] lorem ipsum [[filename|alt name]] adipisci velit [[filename|alt name]]
        ${''}
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/559
      testName: 'Make sure that math blocks followed by a couple of wiki links are not affected',
      before: dedent`
        - $math1$ [[name1 .|alt name1]]  [[name2 |alt name2]]:
        ${''}
        - $math2$
      `,
      after: dedent`
        - $math1$ [[name1 .|alt name1]]  [[name2 |alt name2]]:
        ${''}
        - $math2$
      `,
    },


  ],
});
