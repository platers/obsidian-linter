import InsertYamlAttributes from '../src/rules/insert-yaml-attributes';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: InsertYamlAttributes,
  testCases: [
    {
      testName: 'Inits YAML if it does not exist',
      before: dedent`
        ${''}
      `,
      after: dedent`
        ---
        tags:
        ---
        ${''}
      `,
      options: {
        textToInsert: [
          'tags:',
        ],
      },
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/176
      testName: 'Inits YAML when the file has --- in it and no frontmatter',
      before: dedent`
        # Heading
        Text
        ${''}
        # Heading
        - Text
        - Text
        ---
        ${''}
      `,
      after: dedent`
        ---
        tags:
        ---
        # Heading
        Text
        ${''}
        # Heading
        - Text
        - Text
        ---
        ${''}
      `,
      options: {
        textToInsert: [
          'tags:',
        ],
      },
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/157
      testName: 'When a file has tabs at the start of a line in the frontmatter, the YAML insertion still works leaving other tabs as they were',
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
        textToInsert: [
          'blob:',
        ],
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1550
      testName: 'Make sure that insert text that is lacking a colon in the line gets one added',
      before: dedent`
        ---
        created: 2026-07-17_21:40
        modified: 2026-07-20_10:10
        obsidianUIMode: source
        obsidianEditingMode: source
        title: detached_head
        linter-yaml-title-alias: detached head
        aliases:
          - detached head
          - detached HEAD
          - detached_head
        tags:
          - git
        topics:
          - git
        ---
        # detached head

        Paraphrased from [git-checkout](https://git-scm.com/docs/git-checkout#_detached_head).

        \`HEAD\` normally refers to a named branch, e. g. \`master\` or \`new-feature_dev\`. Each branch refers to a specific commit. When you create a new commit, the branch is updated to refer to the new commit, e. g. \`HEAD\` points \`master\`, and therefore to the latest commit, \`c\`. When you commit \`d\`, \`master\` is updated to \`d\` and \`HEAD\` now indirectly points to \`d\`.

        [[detached_head|detached head]]

        When you \`checkout\` a commit not referenced by a named branch, e. g., \`c\`, our local \`HEAD\` now directly points to \`c\`. Since \`c\` is not a named branch, we are in a detached \`HEAD\` state. This just means that \`HEAD\` points to a specific commit and not a named branch. We can make as many new commits as we want, and \`HEAD\` will point to that latest commit, e. g., \`f\`.

        When we later checkout \`master\`, \`HEAD\` now indirectly points to commit \`d\`, and nothing refers to \`f\`. git garbage collection will eventually delete \`f\` and therefore \`e\`--the commits that are not part of any branch. You can later create a new branch, \`git checkout -b foo\`, which will refer to \`f\` and \`HEAD\` will update to refer to \`foo\`. This will take us out of a detached \`HEAD\`. You can also create a new branch without checking it out or create a new tag, but both of these will leave us in a detached \`HEAD\` STATE.
      `,
      after: dedent`
        ---
        keywords:
        created: 2026-07-17_21:40
        modified: 2026-07-20_10:10
        obsidianUIMode: source
        obsidianEditingMode: source
        title: detached_head
        linter-yaml-title-alias: detached head
        aliases:
          - detached head
          - detached HEAD
          - detached_head
        tags:
          - git
        topics:
          - git
        ---
        # detached head

        Paraphrased from [git-checkout](https://git-scm.com/docs/git-checkout#_detached_head).

        \`HEAD\` normally refers to a named branch, e. g. \`master\` or \`new-feature_dev\`. Each branch refers to a specific commit. When you create a new commit, the branch is updated to refer to the new commit, e. g. \`HEAD\` points \`master\`, and therefore to the latest commit, \`c\`. When you commit \`d\`, \`master\` is updated to \`d\` and \`HEAD\` now indirectly points to \`d\`.

        [[detached_head|detached head]]

        When you \`checkout\` a commit not referenced by a named branch, e. g., \`c\`, our local \`HEAD\` now directly points to \`c\`. Since \`c\` is not a named branch, we are in a detached \`HEAD\` state. This just means that \`HEAD\` points to a specific commit and not a named branch. We can make as many new commits as we want, and \`HEAD\` will point to that latest commit, e. g., \`f\`.

        When we later checkout \`master\`, \`HEAD\` now indirectly points to commit \`d\`, and nothing refers to \`f\`. git garbage collection will eventually delete \`f\` and therefore \`e\`--the commits that are not part of any branch. You can later create a new branch, \`git checkout -b foo\`, which will refer to \`f\` and \`HEAD\` will update to refer to \`foo\`. This will take us out of a detached \`HEAD\`. You can also create a new branch without checking it out or create a new tag, but both of these will leave us in a detached \`HEAD\` STATE.
      `,
      options: {
        textToInsert: [
          'aliases',
          'tags',
          'topics',
          'keywords',
        ],
      },
    },
  ],
});
