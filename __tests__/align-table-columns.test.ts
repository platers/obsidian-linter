import dedent from 'ts-dedent';
import { ruleTest } from './common';
import AlignTable from '../src/rules/align-table-columns';

ruleTest({
  RuleBuilderClass: AlignTable,
  testCases: [
    {
      testName: 'Make sure that formatting a table in a table in a blockqoute works just fine',
      before: dedent`
        > | Column 1 | Column 2 |
        > |-------|-------|
        > | foo1| bar1|
        > | foo2 | bar2                  |
        > | foo3   | bar3    |
      `,
      after: dedent`
        > | Column 1 | Column 2 |
        > |----------|----------|
        > | foo1     | bar1     |
        > | foo2     | bar2     |
        > | foo3     | bar3     |
      `,
    },
    {
      testName: 'Inconsistent line starts should be standardized to the same start as the first line (for better or worse)',
      before: dedent`
        > | Column 1 | Column 2 |
        >    |-------|-------|
         | foo1| bar1|
        > | foo2 | bar2                  |
        > | foo3   | bar3    |
      `,
      after: dedent`
        > | Column 1 | Column 2 |
        > |----------|----------|
        > | foo1     | bar1     |
        > | foo2     | bar2     |
        > | foo3     | bar3     |
      `,
    },
    {
      testName: 'Make sure that a blockquote with a list item is properly handled and made to be aligned',
      before: dedent`
        ${''}- An item
        ${''}- Some item
        ${''}
        ${''}  | Column 1 | Column 2 |
        ${''}  |-------|-------|
        ${''}  | foo1| bar1|
        ${''}  | foo2 | bar2                  |
        ${''}  | foo3   | bar3    |
      `,
      after: dedent`
        ${''}- An item
        ${''}- Some item
        ${''}
        ${''}  | Column 1 | Column 2 |
        ${''}  |----------|----------|
        ${''}  | foo1     | bar1     |
        ${''}  | foo2     | bar2     |
        ${''}  | foo3     | bar3     |
      `,
    },
    {
      testName: 'Make sure that a blockquote with a list item with a table in it is properly handled and made to be aligned',
      before: dedent`
        > 	- An item
        > 	- Some item
        >
        >  		| Column 1 | Column 2 |
        >  		|-------|-------|
        >  		| foo1| bar1|
        >  		| foo2 | bar2                  |
        >  		| foo3   | bar3    |
      `,
      after: dedent`
        > 	- An item
        > 	- Some item
        >
        >  		| Column 1 | Column 2 |
        >  		|----------|----------|
        >  		| foo1     | bar1     |
        >  		| foo2     | bar2     |
        >  		| foo3     | bar3     |
      `,
    },
  ],
});
