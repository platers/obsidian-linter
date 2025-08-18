import RemoveEmptyLinesBetweenListMarkersAndChecklists from '../src/rules/remove-empty-lines-between-list-markers-and-checklists';
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
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/1354
      testName: 'Make sure that empty lines for list markers includes lines with just whitespace',
      before: dedent`
        - \`Collection<E>\` represents a group of **individual elements** (E, like a list of names).
        ${'\t'}
        - \`Map<K, V>\` represents a collection of **key-value pairs** (e.g., a phonebook: name → number).
        ${' \t'}
        ${'  '}- \`List<E>\` ...
      `,
      after: dedent`
        - \`Collection<E>\` represents a group of **individual elements** (E, like a list of names).
        - \`Map<K, V>\` represents a collection of **key-value pairs** (e.g., a phonebook: name → number).
        ${'  '}- \`List<E>\` ...
      `,
    },
  ],
});
