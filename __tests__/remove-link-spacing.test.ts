import RemoveLinkSpacing from '../src/rules/remove-link-spacing';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: RemoveLinkSpacing,
  testCases: [
    {
      testName: 'A link in a section the linter was told to leave alone keeps its spacing',
      before: dedent`
        [ trimmed ](path/fileName.md)

        <!-- linter-disable -->
        [ left alone ](path/fileName.md)
        <!-- linter-enable -->
      `,
      after: dedent`
        [trimmed](path/fileName.md)

        <!-- linter-disable -->
        [ left alone ](path/fileName.md)
        <!-- linter-enable -->
      `,
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/236
      testName: 'Link after checkbox is not affected by removing whitespace in links',
      before: dedent`
        - [ ] [Link text](path/fileName.md)
        - [ ] [[fileName]]
      `,
      after: dedent`
        - [ ] [Link text](path/fileName.md)
        - [ ] [[fileName]]
      `,
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/236
      testName: 'Alias with an email in it should not cause an issue',
      before: dedent`
        ---
        title: John & Jane Doe
        aliases: [John & Jane Doe, email@example.xyz, (123) 456-7890]
        cssclass: [table-lines-bright, col-lines, row-lines]
        ---

        # John & Jane Doe

        This stuff doesn't really matter.
      `,
      after: dedent`
        ---
        title: John & Jane Doe
        aliases: [John & Jane Doe, email@example.xyz, (123) 456-7890]
        cssclass: [table-lines-bright, col-lines, row-lines]
        ---

        # John & Jane Doe

        This stuff doesn't really matter.
      `,
    },
  ],
});

