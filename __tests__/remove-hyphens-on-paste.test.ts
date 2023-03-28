import RemoveHyphensOnPaste from '../src/rules/remove-hyphens-on-paste';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: RemoveHyphensOnPaste,
  testCases: [
    { // accounts for https://github.com/platers/obsidian-linter/issues/653
      testName: 'Make sure that hyphenated line breaks does not apply to YAML frontmatter on paste',
      before: dedent`
        ---
        created: "2023-03-17"
        aliases: []
        source: 
        tags: []
        updated: "2023-03-17T11:51:50-0400"
        ---
        # Hello world
        ${''}
        Paragraph contents are here- [link text](pathToFile/file.md)
        Paragraph contents are here- [[file]]
      `,
      after: dedent`
        ---
        created: "2023-03-17"
        aliases: []
        source: 
        tags: []
        updated: "2023-03-17T11:51:50-0400"
        ---
        # Hello world
        ${''}
        Paragraph contents are here- [link text](pathToFile/file.md)
        Paragraph contents are here- [[file]]
      `,
    },
  ],
});
