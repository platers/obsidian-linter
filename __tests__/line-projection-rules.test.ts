import EmptyLineAroundBlockquotes from '../src/rules/empty-line-around-blockquotes';
import EmptyLineAroundCodeFences from '../src/rules/empty-line-around-code-fences';
import EmptyLineAroundHorizontalRules from '../src/rules/empty-line-around-horizontal-rules';
import EmptyLineAroundMathBlock from '../src/rules/empty-line-around-math-block';
import MoveMathBlockIndicatorsToOwnLine from '../src/rules/move-math-block-indicators-to-own-line';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: MoveMathBlockIndicatorsToOwnLine,
  testCases: [
    {
      testName: 'Uses the effective quote prefix after multiline inline code',
      before: '> `x\ny` $$x$$',
      after: '> `x\ny`\n> $$\n> x\n> $$',
    },
    {
      testName: 'Preserves sequential processing of overlapping math block ranges',
      before: '$$\nx$$\n$$',
      after: '$$\nx\n$$\n$$',
    },
    {
      testName: 'Leaves math indicators inside fenced code alone',
      before: '```\n$$x$$\n```',
      after: '```\n$$x$$\n```',
    },
    {
      testName: 'Leaves math indicators inside disabled sections alone',
      before: '<!-- linter-disable -->\n$$x$$\n<!-- linter-enable -->',
      after: '<!-- linter-disable -->\n$$x$$\n<!-- linter-enable -->',
    },
  ],
});

ruleTest({
  RuleBuilderClass: EmptyLineAroundMathBlock,
  testCases: [
    {
      testName: 'Adds a blank quote line between a protected fence and math',
      before: '> ```\n> code\n> ```\n> $$\n> x\n> $$',
      after: '> ```\n> code\n> ```\n>\n> $$\n> x\n> $$',
    },
    {
      testName: 'Adds a blank quote line between math and a protected fence',
      before: '> $$\n> x\n> $$\n> ```\n> code\n> ```',
      after: '> $$\n> x\n> $$\n>\n> ```\n> code\n> ```',
    },
    {
      testName: 'Leaves math spacing inside fenced code alone',
      before: '```\ntext\n$$x$$\ntext\n```',
      after: '```\ntext\n$$x$$\ntext\n```',
    },
    {
      testName: 'Leaves math spacing inside disabled sections alone',
      before: '<!-- linter-disable -->\ntext\n$$x$$\ntext\n<!-- linter-enable -->',
      after: '<!-- linter-disable -->\ntext\n$$x$$\ntext\n<!-- linter-enable -->',
    },
    {
      testName: 'Maps inline math positions after the block math spacing pass',
      before: '$$\nx\n$$\ntext\n$$y$$\ntext',
      after: '$$\nx\n$$\n\ntext\n\n$$y$$\n\ntext',
    },
  ],
});

ruleTest({
  RuleBuilderClass: EmptyLineAroundCodeFences,
  testCases: [
    {
      testName: 'Leaves inner fence spacing inside a longer fenced code block alone',
      before: '````\ntext\n```\ncode\n```\ntext\n````',
      after: '````\ntext\n```\ncode\n```\ntext\n````',
    },
    {
      testName: 'Leaves fence spacing inside disabled sections alone',
      before: '<!-- linter-disable -->\ntext\n```\ncode\n```\ntext\n<!-- linter-enable -->',
      after: '<!-- linter-disable -->\ntext\n```\ncode\n```\ntext\n<!-- linter-enable -->',
    },
    {
      testName: 'Preserves fence adjacency to math in a blockquote',
      before: '> ```\n> code\n> ```\n> $$\n> x\n> $$',
      after: '> ```\n> code\n> ```\n> $$\n> x\n> $$',
    },
  ],
});

ruleTest({
  RuleBuilderClass: EmptyLineAroundBlockquotes,
  testCases: [
    {
      testName: 'Leaves quote spacing inside fenced code alone',
      before: '```\ntext\n> quote\n# heading\n```',
      after: '```\ntext\n> quote\n# heading\n```',
    },
    {
      testName: 'Leaves quote spacing inside disabled sections alone',
      before: '<!-- linter-disable -->\ntext\n> quote\n# heading\n<!-- linter-enable -->',
      after: '<!-- linter-disable -->\ntext\n> quote\n# heading\n<!-- linter-enable -->',
    },
  ],
});

ruleTest({
  RuleBuilderClass: EmptyLineAroundHorizontalRules,
  testCases: [
    {
      testName: 'Leaves horizontal rule spacing inside fenced code alone',
      before: '```\ntext\n***\ntext\n```',
      after: '```\ntext\n***\ntext\n```',
    },
    {
      testName: 'Leaves horizontal rule spacing inside disabled sections alone',
      before: '<!-- linter-disable -->\ntext\n***\ntext\n<!-- linter-enable -->',
      after: '<!-- linter-disable -->\ntext\n***\ntext\n<!-- linter-enable -->',
    },
  ],
});
