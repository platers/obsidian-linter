import ConvertSpacesToTabs from '../src/rules/convert-spaces-to-tabs';
import dedent from 'ts-dedent';
import {ruleTest} from './common';
import {ignoreListOfTypes} from '../src/utils/ignore-types';

ruleTest({
  RuleBuilderClass: ConvertSpacesToTabs,
  testCases: [
    {
      testName: 'Leaves indentation inside fenced code alone after earlier replacements shift its offsets',
      before: '- item\n        - outside\n```\n        code\n>     code\n```\n>     outside',
      after: '- item\n\t\t- outside\n```\n        code\n>     code\n```\n>     outside',
    },
    {
      testName: 'Leaves indentation inside disabled sections alone',
      before: '<!-- linter-disable -->\n        - item\n>     item\n<!-- linter-enable -->\n>     outside',
      after: '<!-- linter-disable -->\n        - item\n>     item\n<!-- linter-enable -->\n>     outside',
    },
    {
      testName: 'Basic case',
      before: dedent`
        - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            - Vestibulum id tortor lobortis, tristique mi quis, pretium metus.
        - Nunc ut arcu fermentum enim auctor accumsan ut a risus.
                - Donec ut auctor dui.
      `,
      after: dedent`
        - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        \t- Vestibulum id tortor lobortis, tristique mi quis, pretium metus.
        - Nunc ut arcu fermentum enim auctor accumsan ut a risus.
        \t\t- Donec ut auctor dui.
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/410
      testName: 'Properly converts callout spaces to tabs',
      before: dedent`
        > [!note]
        > - A
        >     - B
        > - C
      `,
      after: dedent`
        > [!note]
        > - A
        > \t- B
        > - C
      `,
    },
    { // relates to https://github.com/platers/obsidian-linter/issues/410
      testName: 'Properly converts callout spaces to tabs with nested callouts',
      before: dedent`
        > Blockquote 1
        >> [!note]
        > > - A
        > >     - B
        >> - C
      `,
      after: dedent`
        > Blockquote 1
        >> [!note]
        > > - A
        > > \t- B
        >> - C
      `,
    },
  ],
});

describe('protected-range compatibility', () => {
  it.each([
    '- item\n    \t    - child',
    '>\t    >     text',
    '>\t >  text',
    '- item\n        - child\n```\n        code\n```\n>     outside',
  ])('preserves dependent passes in %j', (text) => {
    const builder = new ConvertSpacesToTabs();
    for (const tabsize of [1, 2, 3, 4]) {
      const expected = ignoreListOfTypes(builder.ignoreTypes, text, (value) => {
        for (const regex of [
          new RegExp('^(\t*) {' + tabsize + '}', 'gm'),
          new RegExp('^((>( |\t*))*(>( |\t))\t*) {' + tabsize + '}', 'gm'),
        ]) {
          while (value.match(regex) != null) {
            value = value.replace(regex, '$1\t');
          }
        }
        return value;
      });
      expect(ConvertSpacesToTabs.getRule().apply(text, {tabsize})).toBe(expected);
    }
  });
});
