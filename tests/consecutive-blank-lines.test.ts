import ConsecutiveBlankLines from '../src/rules/consecutive-blank-lines';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: ConsecutiveBlankLines,
  testCases: [
    {
      testName: 'Handles ignores code blocks',
      before: dedent`
        Line 1
        ${''}
        ${''}
        \`\`\`
        ${''}
        ${''}
        ${''}
        \`\`\`
      `,
      after: dedent`
        Line 1
        ${''}
        \`\`\`
        ${''}
        ${''}
        ${''}
        \`\`\`
      `,
    },
  ],
});
