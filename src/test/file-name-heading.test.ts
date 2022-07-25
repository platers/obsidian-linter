import FileNameHeading from '../rules/file-name-heading';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: FileNameHeading,
  testCases: [
    {
      testName: 'Handles stray dashes',
      before: dedent`
        Text 1

        ---
        
        Text 2
      `,
      after: dedent`
        # File Name
        Text 1

        ---

        Text 2
      `,
      options: {
        fileName: 'File Name',
      },
    },
  ],
});
