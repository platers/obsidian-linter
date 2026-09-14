import ParagraphBlankLines from '../src/rules/paragraph-blank-lines';
import {ruleTest} from './common';

const excludedBlocks = [
  {name: 'list', text: '- item\n- another item'},
  {name: 'blockquote', text: '> quoted\n> continued'},
  {name: 'footnote definition', text: '[^note]: definition\n    continued'},
  {name: 'table', text: '| a |\n| - |\n| b |'},
  {name: 'obsidian multiline comment', text: '%%\nhidden\ncontinued\n%%'},
];

ruleTest({
  RuleBuilderClass: ParagraphBlankLines,
  testCases: [
    ...[
      {name: '<br>', indicator: '<br>', gap: '\n'},
      {name: '<br/>', indicator: '<br/>', gap: '\n'},
      {name: 'two spaces', indicator: '  ', gap: '\n'},
      {name: 'one backslash', indicator: '\\', gap: '\n'},
      {name: 'escaped double backslash', indicator: '\\\\', gap: '\n\n'},
    ].map(({name, indicator, gap}) => ({
      testName: `Preserves internal line ending semantics for ${name}`,
      before: `first${indicator}\nsecond\nthird`,
      after: `first${indicator}${gap}second\n\nthird`,
    })),
    ...['<br>', '<br/>', '  ', '\\', '\\\\'].map((indicator) => ({
      testName: `Preserves legacy internal CRLF detection after ${JSON.stringify(indicator)}`,
      before: `first${indicator}\r\nsecond\r\nthird\r\n`,
      // Splitting on LF leaves CR after the indicator, so it is not a hard break.
      after: `first${indicator}\r\n\nsecond\r\n\nthird\n`,
    })),
    {testName: 'Consumes a final CR', before: 'a\r', after: 'a'},
    {testName: 'Consumes a final CRLF and restores one LF', before: 'a\r\n', after: 'a\n'},
    {
      testName: 'Preserves legacy CRLF gaps throughout a document with several paragraphs',
      before: 'first\r\n\r\nsecond\r\n\r\nthird\r\n',
      after: 'first\n\n\r\n\nsecond\n\n\r\n\nthird\n',
    },
    ...excludedBlocks.flatMap(({name, text}) => [2, 4].map((newlines) => ({
      testName: `Normalizes ${newlines} newlines on both sides of an excluded ${name}`,
      before: `before${'\n'.repeat(newlines)}${text}${'\n'.repeat(newlines)}after`,
      after: `before\n\n${text}\n\nafter`,
    }))),
    ...excludedBlocks.filter(({name}) => name != 'footnote definition').map(({name, text}) => ({
      testName: `Separates a paragraph directly before an excluded ${name}`,
      before: `before\n${text}\n\nafter`,
      after: `before\n\n${text}\n\nafter`,
    })),
    ...[0, 1, 3].flatMap((leading) => [0, 1, 3].map((trailing) => ({
      testName: `Normalizes ${leading} leading and ${trailing} trailing newlines with shared paragraph gaps`,
      before: `${'\n'.repeat(leading)}first\n\n\nsecond\n\nthird${'\n'.repeat(trailing)}`,
      after: `first\n\nsecond\n\nthird${trailing ? '\n' : ''}`,
    }))),
    ...[0, 1, 3].map((trailing) => ({
      testName: `Leaves only excluded paragraphs and ${trailing} trailing newlines unchanged`,
      before: `\n\n- item\n\n\n> quoted\n\n\n[^note]: definition${'\n'.repeat(trailing)}`,
      after: `\n\n- item\n\n\n> quoted\n\n\n[^note]: definition${'\n'.repeat(trailing)}`,
    })),
    ...[0, 1, 3].map((trailing) => ({
      testName: `Preserves ${trailing} trailing newlines after an excluded final paragraph`,
      before: `before\n\n\n> quoted${'\n'.repeat(trailing)}`,
      after: `before\n\n> quoted${'\n'.repeat(trailing)}`,
    })),
    {testName: 'Leaves an empty document unchanged', before: '', after: ''},
    {testName: 'Leaves a newline-only document unchanged', before: '\n\n\n', after: '\n\n\n'},
  ],
});
