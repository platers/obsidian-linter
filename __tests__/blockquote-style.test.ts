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
    { // accounts for https://github.com/platers/obsidian-linter/issues/935
      testName: 'Make sure we properly handle removing spaces from blockquote indicators instead of removing them from values that are not at the start of the line',
      before: dedent`
        > Using a C++ "member of pointer" operator: \`pointer-> field\`
        > \`> \`
      `,
      after: dedent`
        >Using a C++ "member of pointer" operator: \`pointer-> field\`
        >\`> \`
      `,
      options: {style: 'no space'},
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/961
      testName: 'Multiple spaces after a blockquote indicator is converted into one space',
      before: dedent`
        >   Text here
        >     >           More Text Here
        > \t > \t\t\t >Some More Text
      `,
      after: dedent`
        > Text here
        > > More Text Here
        > > > Some More Text
      `,
      options: {style: 'space'},
    },
  ],
});
