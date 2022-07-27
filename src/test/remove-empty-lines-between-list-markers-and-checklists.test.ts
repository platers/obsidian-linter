import RemoveEmptyLinesBetweenListMarkersAndChecklists from '../rules/remove-empty-lines-between-list-markers-and-checklists';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: RemoveEmptyLinesBetweenListMarkersAndChecklists,
  testCases: [
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/283
      testName: 'Horizontal Rules after list should not be affected',
      before: dedent`
        Starting Text
        ${''}
        ---
        ${''}
        - Some list item 1
        - Some list item 2
        ${''}
        ---
        ${''}
        Some text
        ${''}
        ***
        ${''}
        * Some list item 1
        * Some list item 2
        ${''}
        ***
        ${''}
        More Text
      `,
      after: dedent`
        Starting Text
        ${''}
        ---
        ${''}
        - Some list item 1
        - Some list item 2
        ${''}
        ---
        ${''}
        Some text
        ${''}
        ***
        ${''}
        * Some list item 1
        * Some list item 2
        ${''}
        ***
        ${''}
        More Text
      `,
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/318
      testName: 'Make sure that italics followed by a blank and then italics and vice versa are left alone',
      before: dedent`
        *Some italicized item:* some detail
        ${''}
        **Some bold item:** some other detail
        ${''}
        *Some more italicized item:* some detail
        ${''}
      `,
      after: dedent`
        *Some italicized item:* some detail
        ${''}
        **Some bold item:** some other detail
        ${''}
        *Some more italicized item:* some detail
        ${''}
      `,
    },
  ],
});
