import RemoveTrailingPunctuationInHeading from '../src/rules/remove-trailing-punctuation-in-heading';
import {ruleTest} from './common';

const defaultPunctuation = '.,;:!。，；：！';

ruleTest({
  RuleBuilderClass: RemoveTrailingPunctuationInHeading,
  testCases: [
    {
      testName: 'Leaves trailing heading punctuation inside fenced code alone',
      before: '```\n# inside!\n```\n# outside!',
      after: '```\n# inside!\n```\n# outside',
    },
    {
      testName: 'Leaves trailing heading punctuation inside disabled sections alone',
      before: '<!-- linter-disable -->\n# inside!\n<!-- linter-enable -->\n# outside!',
      after: '<!-- linter-disable -->\n# inside!\n<!-- linter-enable -->\n# outside',
    },
    {
      testName: 'Preserves masking behavior across a multiline disabled section in a heading',
      before: '# <!-- linter-disable -->\n<!-- linter-enable -->!',
      after: '# <!-- linter-disable -->\n<!-- linter-enable -->',
    },
    {
      testName: 'Maps punctuation edits around protected blocks in source order',
      before: '# first!!\n```\n# inside!\n```\n# <!-- linter-disable -->\n<!-- linter-enable -->!!  ##\n# last!',
      after: '# first\n```\n# inside!\n```\n# <!-- linter-disable -->\n<!-- linter-enable -->  ##\n# last',
    },
    {
      testName: 'A single trailing punctuation character is removed',
      before: '# Heading.',
      after: '# Heading',
      options: {punctuationToRemove: defaultPunctuation},
    },
    { // removing one character per run left the file changing on every lint and losing a character each time
      testName: 'Several trailing punctuation characters are all removed in one pass',
      before: '# Heading!!!',
      after: '# Heading',
      options: {punctuationToRemove: defaultPunctuation},
    },
    {
      testName: 'A mixture of trailing punctuation characters is removed in one pass',
      before: '# Heading!?.,;',
      after: '# Heading!?',
      options: {punctuationToRemove: defaultPunctuation},
    },
    {
      testName: 'Running the rule again changes nothing',
      before: '# Heading',
      after: '# Heading',
      options: {punctuationToRemove: defaultPunctuation},
    },
    {
      testName: 'Trailing whitespace after the punctuation is preserved',
      before: '# Heading!!  ',
      after: '# Heading  ',
      options: {punctuationToRemove: defaultPunctuation},
    },
    {
      testName: 'Punctuation that is not configured for removal is left alone',
      before: '# Heading???',
      after: '# Heading???',
      options: {punctuationToRemove: defaultPunctuation},
    },
    {
      testName: 'Full width punctuation is removed too',
      before: '# 見出し！！',
      after: '# 見出し',
      options: {punctuationToRemove: defaultPunctuation},
    },
    {
      testName: 'A heading of nothing but punctuation is left with no text',
      before: '# ...',
      after: '# ',
      options: {punctuationToRemove: defaultPunctuation},
    },
  ],
});
