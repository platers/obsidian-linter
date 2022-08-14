import RemoveSpaceAroundFullWidthCharacters from '../src/rules/remove-space-around-fullwidth-characters';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: RemoveSpaceAroundFullWidthCharacters,
  testCases: [
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/344
      testName: 'Make sure that lists with a dollar sign in them actually get escaped correctly',
      before: dedent`
        # Title
        ${''}
        - lorem \`$\` ipsum
        ${''}
      `,
      after: dedent`
        # Title
        ${''}
        - lorem \`$\` ipsum
        ${''}
      `,
    },
  ],
});
