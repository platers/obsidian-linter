import ConvertSpacesToTabs from '../src/rules/convert-spaces-to-tabs';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: ConvertSpacesToTabs,
  testCases: [
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
