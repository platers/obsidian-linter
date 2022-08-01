import EmptyLineAroundCodeFences from '../src/rules/empty-line-around-code-fences';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: EmptyLineAroundCodeFences,
  testCases: [
    {
      testName: 'Make sure multiple blank lines at the start and end are removed',
      before: dedent`
        ${''}
        ${''}
        \`\`\`JavaScript
        var text = 'some string';
        \`\`\`
        ${''}
        ${''}
      `,
      after: dedent`
        \`\`\`JavaScript
        var text = 'some string';
        \`\`\`
      `,
    },
    {
      testName: 'Make sure multiple blank lines at the start and end are removed when dealing with blockquotes or callouts',
      before: dedent`
        >
        > ${''}
        > \`\`\`JavaScript
        > var text = 'some string';
        > \`\`\`
        > ${''}
        >
      `,
      after: dedent`
        > \`\`\`JavaScript
        > var text = 'some string';
        > \`\`\`
      `,
    },
  ],
});
