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
        >>>>\tJust a Tab
      `,
      after: dedent`
        > Text here
        > > More Text Here
        > > > Some More Text
        > > > > Just a Tab
      `,
      options: {style: 'space'},
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/961
      testName: 'Multiple spaces after a blockquote indicator is not converted into one space when it is a list item or checklist line when `style=space`',
      before: dedent`
        >   Text here
        >   - List item 1
        >\t * List item 2
        >   + List item 3
        >   1. Ordered item 1
        >   2) Ordered item 2
        >   - [ ] Checklist item
        >- List item 4
      `,
      after: dedent`
        > Text here
        >   - List item 1
        > \t * List item 2
        >   + List item 3
        >   1. Ordered item 1
        >   2) Ordered item 2
        >   - [ ] Checklist item
        > - List item 4
      `,
      options: {style: 'space'},
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/961
      testName: 'Multiple spaces after a blockquote indicator should be removed except when dealing with list mark lines when `style=no space`',
      before: dedent`
        >   Text here
        >   - List item 1
        >\t * List item 2
        >   + List item 3
        >   1. Ordered item 1
        >   2) Ordered item 2
        >   - [ ] Checklist item
        >- List item 4
        > >  >   \t > - List item 5
        > >  >   \t > > - List item 6
      `,
      after: dedent`
        >Text here
        >   - List item 1
        >\t * List item 2
        >   + List item 3
        >   1. Ordered item 1
        >   2) Ordered item 2
        >   - [ ] Checklist item
        >- List item 4
        >>>> - List item 5
        >>>>> - List item 6
      `,
      options: {style: 'no space'},
    },
  ],
});
