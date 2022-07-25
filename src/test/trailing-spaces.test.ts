import TrailingSpaces from '../rules/trailing-spaces';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: TrailingSpaces,
  testCases: [
    {
      testName: 'One trailing space removed',
      before: dedent`
        # H1 ${''}
        line with one trailing spaces ${''}
      `,
      after: dedent`
        # H1
        line with one trailing spaces
      `,
    },
    {
      testName: 'Three trailing whitespaces removed',
      before: dedent`
        # H1   ${''}
        line with three trailing spaces   ${''}
      `,
      after: dedent`
        # H1
        line with three trailing spaces
      `,
    },
    {
      testName: 'Tab-Space-Linebreak removed',
      before: dedent`
        # H1
        line with trailing tab and spaces    ${''}
        ${''}
      `,
      after: dedent`
        # H1
        line with trailing tab and spaces
        ${''}
      `,
      options: {
        twoSpaceLineBreak: true,
      },
    },
    {
      testName: 'Two Space Linebreak not removed',
      before: dedent`
        # H1
        line with one trailing spaces  ${''}
        ${''}
      `,
      after: dedent`
        # H1
        line with one trailing spaces  ${''}
        ${''}
      `,
      options: {
        twoSpaceLineBreak: true,
      },
    },
    {
      testName: 'Regular link with spaces stays the same',
      before: dedent`
        # Hello world
        ${''}
        [This has  spaces in it](File with  spaces.md)
      `,
      after: dedent`
        # Hello world
        ${''}
        [This has  spaces in it](File with  spaces.md)
      `,
    },
    {
      testName: 'Image link with spaces stays the same',
      before: dedent`
        # Hello world
        ${''}
        ![This has  spaces in it](File with  spaces.png)
      `,
      after: dedent`
        # Hello world
        ${''}
        ![This has  spaces in it](File with  spaces.png)
      `,
    },
    {
      testName: 'Wiki link with spaces stays the same',
      before: dedent`
        # Hello world
        ${''}
        [[File with  spaces]]
      `,
      after: dedent`
        # Hello world
        ${''}
        [[File with  spaces]]
      `,
    },
  ],
});
