import RemoveLeftoverFootnotesFromQuoteOnPaste from '../src/rules/remove-leftover-footnotes-from-quote-on-paste';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: RemoveLeftoverFootnotesFromQuoteOnPaste,
  testCases: [
    {
      testName: 'Preserves existing removal inside fenced code, which this paste rule does not ignore',
      before: '```\nText.50\n```',
      after: '```\nText\n```',
    },
    {
      testName: 'Leaves leftover footnotes inside a disabled section unchanged',
      before: '<!-- linter-disable -->\nText.50\n<!-- linter-enable -->\n\nText.60',
      after: '<!-- linter-disable -->\nText.50\n<!-- linter-enable -->\n\nText',
    },
    {
      testName: 'Removes a leftover footnote after a protected link without changing its contents',
      before: '[Text.50](target).60 [[Text.70]],80',
      after: '[Text.50](target) [[Text.70]]',
    },
  ],
});
