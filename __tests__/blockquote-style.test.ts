import BlockquoteStyle from '../src/rules/blockquote-style';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: BlockquoteStyle,
  testCases: [
    { // accounts for https://github.com/platers/obsidian-linter/issues/935
      testName: 'Make sure we properly handle adding spaces to blockquote indicators instead of adding them to values that are not at the start of the line',
      before: dedent`
        > Using a C++ "member of pointer" operator: \`pointer->field\`
        >\`>\`
      `,
      after: dedent`
        > Using a C++ "member of pointer" operator: \`pointer->field\`
        > \`>\`
      `,
      options: {style: 'space'},
    },
    // { // accounts for https://github.com/platers/obsidian-linter/issues/935
    //   testName: 'Make sure we properly handle removing spaces from blockquote indicators instead of removing them from values that are not at the start of the line',
    //   before: dedent`
    //     > Using a C++ "member of pointer" operator: \`pointer-> field\`
    //     > \`> \`
    //   `,
    //   after: dedent`
    //     >Using a C++ "member of pointer" operator: \`pointer-> field\`
    //     >\`> \`
    //   `,
    //   options: {style: 'no space'},
    // },
  ],
});
