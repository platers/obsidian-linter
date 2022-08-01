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
  ],
});
