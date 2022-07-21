import InsertYamlAttributes from '../rules/insert-yaml-attributes';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: InsertYamlAttributes,
  testCases: [
    {
      testName: 'Inits yaml if it does not exist',
      before: dedent`
      `,
      after: dedent`
        ---
        tags:
        ---

      `,
      options: {
        textToInsert: 'tags:',
      },
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/176
      testName: 'Inits yaml when the file has --- in it and no frontmatter',
      before: dedent`
        # Heading
        Text

        # Heading
        - Text
        - Text
        ---

      `,
      after: dedent`
        ---
        tags:
        ---
        # Heading
        Text

        # Heading
        - Text
        - Text
        ---

      `,
      options: {
        textToInsert: 'tags:',
      },
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/157
      testName: 'When a file has tabs at the start of a line in the frontmatter, the yaml insertion still works leaving other tabs as they were',
      before: dedent`
        ---
        title: this title\thas a tab
        tags:
        \t- test1
        \t- test2
        ---
      `,
      after: dedent`
        ---
        blob:
        title: this title\thas a tab
        tags:
        \t- test1
        \t- test2
        ---
      `,
      options: {
        textToInsert: 'blob:',
      },
    },
  ],
});
