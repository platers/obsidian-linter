import HeadingStartLine from '../src/rules/headings-start-line';
import SpaceAfterListMarkers from '../src/rules/space-after-list-markers';
import QuoteStyle from '../src/rules/quote-style';
import * as protectedRangeUtils from '../src/utils/protected-ranges';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: HeadingStartLine,
  testCases: [
    {
      testName: 'Leaves heading indentation inside fenced code alone',
      before: '```\n  # inside\n```\n  # outside',
      after: '```\n  # inside\n```\n# outside',
    },
    {
      testName: 'Leaves heading indentation inside disabled sections alone',
      before: '<!-- linter-disable -->\n  # inside\n<!-- linter-enable -->\n  # outside',
      after: '<!-- linter-disable -->\n  # inside\n<!-- linter-enable -->\n# outside',
    },
    {
      testName: 'Trims indentation before a heading containing a multiline disabled section',
      before: '  # <!-- linter-disable -->\n<!-- linter-enable --> tail',
      after: '# <!-- linter-disable -->\n<!-- linter-enable --> tail',
    },
    {
      testName: 'Leaves blank lines and heading text unchanged',
      before: '\n\n  ## heading!  ##\r\n\n # next\n',
      after: '\n\n## heading!  ##\r\n\n# next\n',
    },
  ],
});

it.each([HeadingStartLine.getRule(), SpaceAfterListMarkers.getRule(), QuoteStyle.getRule()])('$alias rejects overlapping edits before applying them', (rule) => {
  const collector = jest.spyOn(protectedRangeUtils, 'collectUnprotectedRegexReplacements').mockReturnValueOnce([
    {startIndex: 0, endIndex: 2, value: ''},
    {startIndex: 1, endIndex: 3, value: ''},
  ]);
  try {
    expect(() => rule.apply('abc')).toThrow('Rule replacements must be ordered and non-overlapping');
  } finally {
    collector.mockRestore();
  }
});
