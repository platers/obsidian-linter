import BlockquoteStyle from '../src/rules/blockquote-style';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: BlockquoteStyle,
  testCases: [
    { // Nested blockquotes are rewritten once per level; a single pass loses the inner marker spacing.
      testName: 'Nested blockquotes retain the spacing introduced by rewriting each level',
      before: '>>ab',
      after: '> > ab',
      options: {style: 'space'},
    },
    {
      testName: 'Fenced code and math block lines keep their markers while surrounding quote lines gain spaces',
      before: '>before\n>```\n>  code\n>```\n>$$\n>  x\n>$$\n>after',
      after: '> before\n>```\n>  code\n>```\n>$$\n>  x\n>$$\n> after',
      options: {style: 'space'},
    },
    {
      testName: 'Fenced code and math block lines keep their markers while surrounding quote lines lose spaces',
      before: '> before\n> ```\n>   code\n> ```\n> $$\n>   x\n> $$\n> after',
      after: '>before\n> ```\n>   code\n> ```\n> $$\n>   x\n> $$\n>after',
      options: {style: 'no space'},
    },
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
        > \t > \t >Some More Text
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
        > >  > \t > - List item 5
        > >  > \t > > - List item 6
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
    { // an empty blockquote line keeps no trailing space, otherwise "trailing spaces" removes it again and the two rules never settle
      testName: 'Blockquote lines with nothing on them do not get a space added after the indicator',
      before: '> a\n>\n> b',
      after: '> a\n>\n> b',
      options: {style: 'space'},
    },
    {
      testName: 'Nested blockquote lines with nothing on them do not get a space added after the indicator',
      before: '> > a\n> >\n> > b',
      after: '> > a\n> >\n> > b',
      options: {style: 'space'},
    },
    {
      testName: 'An existing trailing space on an empty blockquote line is removed',
      before: '> a\n> \n> b',
      after: '> a\n>\n> b',
      options: {style: 'space'},
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1055
      testName: 'Code blocks in a blockquote should not have their spacing affected since that can remove indentation for code',
      before: dedent`
        > Example blockquote
        >Wrongly indented line
        >
        >\`\`\`javascript
        > function greet() {
        >     console.log("Hello mom!")
        > }
        > \`\`\`
      `,
      after: dedent`
        > Example blockquote
        > Wrongly indented line
        >
        >\`\`\`javascript
        > function greet() {
        >     console.log("Hello mom!")
        > }
        > \`\`\`
      `,
      options: {style: 'space'},
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1087
      testName: 'Math blocks in a blockquote should not have their spacing affected since that can remove indentation for lists',
      before: dedent`
        >[!INFO] Linter sublist latex repro
        > text
        > - list item 1
        >     $$
        >     f = ma
        >     $$
        >     - sublist item 1
        >         $$
        >         y = ax + b
        >         $$
      `,
      after: dedent`
        > [!INFO] Linter sublist latex repro
        > text
        > - list item 1
        >     $$
        >     f = ma
        >     $$
        >     - sublist item 1
        >         $$
        >         y = ax + b
        >         $$
      `,
      options: {style: 'space'},
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1087
      testName: 'Code blocks in a blockquote should not have their spacing affected since that can remove indentation for lists',
      before: dedent`
        >[!INFO] Linter sublist code repro
        > text
        > - list item 1
        >     \`\`\`
        >     f = ma
        >     \`\`\`
        >     - sublist item 1
        >         \`\`\`
        >         y = ax + b
        >         \`\`\`
      `,
      after: dedent`
        > [!INFO] Linter sublist code repro
        > text
        > - list item 1
        >     \`\`\`
        >     f = ma
        >     \`\`\`
        >     - sublist item 1
        >         \`\`\`
        >         y = ax + b
        >         \`\`\`
      `,
      options: {style: 'space'},
    },
  ],
});
