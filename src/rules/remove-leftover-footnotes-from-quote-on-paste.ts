// based on https://github.com/chrisgrieser/obsidian-smarter-paste/blob/master/clipboardModification.ts#L15
import { IgnoreTypes } from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';

class RemoveLeftoverFootnotesFromQuoteOnPasteOptions implements Options {}

@RuleBuilder.register
export default class RemoveLeftoverFootnotesFromQuoteOnPaste extends RuleBuilder<RemoveLeftoverFootnotesFromQuoteOnPasteOptions> {
  constructor() {
    super({
      nameKey: 'rules.remove-leftover-footnotes-from-quote-on-paste.name',
      descriptionKey: 'rules.remove-leftover-footnotes-from-quote-on-paste.description',
      ruleIgnoreTypes: [IgnoreTypes.wikiLink, IgnoreTypes.link, IgnoreTypes.image],
      type: RuleType.PASTE,
    });
  }
  get OptionsClass(): new () => RemoveLeftoverFootnotesFromQuoteOnPasteOptions {
    return RemoveLeftoverFootnotesFromQuoteOnPasteOptions;
  }
  apply(text: string, options: RemoveLeftoverFootnotesFromQuoteOnPasteOptions): string {
    return text.replace(/(\D)[.,]\d+/g, '$1');
  }
  get exampleBuilders(): ExampleBuilder<RemoveLeftoverFootnotesFromQuoteOnPasteOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Footnote reference removed',
        before: dedent`
          He was sure that he would get off without doing any time, but the cops had other plans.50
          ${''}
          _Note that the format for footnote references to remove is a dot or comma followed by any number of digits_
        `,
        after: dedent`
          He was sure that he would get off without doing any time, but the cops had other plans
          ${''}
          _Note that the format for footnote references to remove is a dot or comma followed by any number of digits_
        `,
      }),
      new ExampleBuilder({
        description: 'Footnote reference removal does not affect links',
        before: dedent`
          [[Half is .5]]
          [Half is .5](HalfIs.5.md)
          ![](HalfIs.5.jpg)
          ![[Half is .5.jpg]]
        `,
        after: dedent`
          [[Half is .5]]
          [Half is .5](HalfIs.5.md)
          ![](HalfIs.5.jpg)
          ![[Half is .5.jpg]]
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<RemoveLeftoverFootnotesFromQuoteOnPasteOptions>[] {
    return [];
  }
}
