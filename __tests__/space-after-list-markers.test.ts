import SpaceAfterListMarkers from '../src/rules/space-after-list-markers';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: SpaceAfterListMarkers,
  testCases: [
    {
      // Edits come from more than one pass and have to be ordered together before applying.
      testName: 'Orders marker and checkbox edits together without duplicating empty items',
      before: '- [ ] \n- ',
      after: '- [ ] \n- ',
    },
    {
      testName: 'Leaves marker and checkbox spacing inside fenced code alone',
      before: '```\n-  [ ]  inside\n1.  inside\n```\n-  [ ]  outside\n1.  outside',
      after: '```\n-  [ ]  inside\n1.  inside\n```\n- [ ] outside\n1. outside',
    },
    {
      testName: 'Leaves marker and checkbox spacing inside disabled sections alone',
      before: '<!-- linter-disable -->\n-  [ ]  inside\n1.  inside\n<!-- linter-enable -->\n-  [ ]  outside',
      after: '<!-- linter-disable -->\n-  [ ]  inside\n1.  inside\n<!-- linter-enable -->\n- [ ] outside',
    },
    {
      testName: 'Normalizes only horizontal whitespace after markers and checkboxes',
      before: '1.\t  one\n2.  two\n-  [ ]\t three\n+\t[x]  four\n*  [X]\t five',
      after: '1. one\n2. two\n- [ ] three\n+ [x] four\n* [X] five',
    },
    {
      testName: 'Normalizes spacing before protected content without changing it',
      before: '-  [link](url)\n-  [[wiki]]\n-  #tag\n-  [ ]  [link](url)',
      after: '- [link](url)\n- [[wiki]]\n- #tag\n- [ ] [link](url)',
    },
    {
      testName: 'Does not normalize whitespace after an ordered checkbox',
      before: '1.  [ ]  item\n2.  [x]\t item',
      after: '1. [ ]  item\n2. [x]\t item',
    },
    {
      testName: 'Collects checkbox edits on a later line without rewriting line breaks',
      before: '-  \n [ ]  item',
      after: '- \n [ ] item',
    },
    {
      testName: 'Handles empty bullets',
      before: dedent`
        Line
        - 1
        - ${''}
        Line
      `,
      after: dedent`
        Line
        - 1
        - ${''}
        Line
      `,
    },
  ],
});
