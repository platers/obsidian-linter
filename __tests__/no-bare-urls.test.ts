import NoBareUrls from '../src/rules/no-bare-urls';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: NoBareUrls,
  testCases: [
    {// accounts for https://github.com/platers/obsidian-linter/issues/275
      testName: 'Leaves markdown links and images alone',
      before: dedent`
        [regular link](https://google.com)
        ![image alt text](https://github.com/favicon.ico)
      `,
      after: dedent`
        [regular link](https://google.com)
        ![image alt text](https://github.com/favicon.ico)
      `,
    },
    {// accounts for https://github.com/platers/obsidian-linter/issues/339
      testName: 'Urls with a hashtag referring to header that are surrounded by `<` and `> should be left alone',
      before: dedent`
        <https://google.com#hashtag>
      `,
      after: dedent`
        <https://google.com#hashtag>
      `,
    },
    {// accounts for https://github.com/platers/obsidian-linter/issues/469
      testName: 'Urls that are surrounded by smart quotes should be left alone',
      before: dedent`
        “https://google.com”
        ‘https://google.com’
      `,
      after: dedent`
        “https://google.com”
        ‘https://google.com’
      `,
    },
    {// accounts for https://github.com/platers/obsidian-linter/issues/469
      testName: 'Urls that are in inline code should be left alone',
      before: dedent`
        \`http --headers --follow --all https://google.com\`
      `,
      after: dedent`
        \`http --headers --follow --all https://google.com\`
      `,
    },
    {// accounts for https://github.com/platers/obsidian-linter/issues/588
      testName: 'Make sure that anchor tags are not affected by the rule',
      before: dedent`
        <a href="https://www.google.com" class="tc-tiddlylink-external" rel="noopener noreferrer" target="_blank">https://www.google.com</a>
      `,
      after: dedent`
        <a href="https://www.google.com" class="tc-tiddlylink-external" rel="noopener noreferrer" target="_blank">https://www.google.com</a>
      `,
    },
    {// accounts for https://github.com/platers/obsidian-linter/issues/777
      testName: 'Make sure that iframe tags are not affected by the rule when a space is present in the src attribute of the tag',
      before: dedent`
        > [!note]  [Google](https://www.google.com)
        > <iframe width="100%" height="600" src=" https://www.google.com "></iframe>
      `,
      after: dedent`
        > [!note]  [Google](https://www.google.com)
        > <iframe width="100%" height="600" src=" https://www.google.com "></iframe>
      `,
    },
    {// accounts for https://github.com/platers/obsidian-linter/issues/776
      testName: 'Trailing periods should not be included in the URL that gets enclosed in angle brackets',
      before: dedent`
        - https://theintercept.com/2023/05/23/henry-kissinger-cambodia-bombing-survivors/.
        - https://www.gettyimages.com/detail/news-photo/617942032.
      `,
      after: dedent`
        - <https://theintercept.com/2023/05/23/henry-kissinger-cambodia-bombing-survivors/>.
        - <https://www.gettyimages.com/detail/news-photo/617942032>.
      `,
    },
    {// accounts for https://github.com/platers/obsidian-linter/issues/776
      testName: 'Trailing parentheses should not be included in the URL that gets enclosed in angle brackets',
      before: dedent`
        This is a url followed by a paren https://github.com). Wow that worked!
      `,
      after: dedent`
        This is a url followed by a paren <https://github.com>). Wow that worked!
      `,
    },
    {// accounts for https://github.com/platers/obsidian-linter/issues/776
      testName: 'Does not put angle brackets around URIs when `No Bare URIs` is not enabled',
      before: dedent`
        obsidian://show-plugin?id=cycle-in-sidebar
      `,
      after: dedent`
        obsidian://show-plugin?id=cycle-in-sidebar
      `,
      options: {
        noBareURIs: false,
      },
    },
  ],
});

