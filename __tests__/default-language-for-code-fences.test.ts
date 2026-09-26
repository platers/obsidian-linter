import DefaultLanguageForCodeFences from '../src/rules/default-language-for-code-fences';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: DefaultLanguageForCodeFences,
  testCases: [
    {
      testName: 'A code fence in a section the linter was told to leave alone keeps having no language',
      before: dedent`
        \`\`\`
        gets a language
        \`\`\`

        <!-- linter-disable -->
        \`\`\`
        left alone
        \`\`\`
        <!-- linter-enable -->
      `,
      after: dedent`
        \`\`\`javascript
        gets a language
        \`\`\`

        <!-- linter-disable -->
        \`\`\`
        left alone
        \`\`\`
        <!-- linter-enable -->
      `,
      options: {
        defaultLanguage: 'javascript',
      },
    },
  ],
});
