import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase, TextOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {IgnoreTypes} from '../utils/ignore-types';
import {allHeadersRegex, htmlEntitiesRegex} from '../utils/regex';
import {ProtectedRanges} from '../utils/protected-ranges';
import {replaceTextRanges, textReplacement} from '../utils/strings';

class RemoveTrailingPunctuationInHeadingOptions implements Options {
  punctuationToRemove?: string = '.,;:!。，；：！';
}

@RuleBuilder.register
export default class RemoveTrailingPunctuationInHeading extends RuleBuilder<RemoveTrailingPunctuationInHeadingOptions> {
  constructor() {
    super({
      nameKey: 'rules.remove-trailing-punctuation-in-heading.name',
      descriptionKey: 'rules.remove-trailing-punctuation-in-heading.description',
      type: RuleType.HEADING,
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml],
    });
  }
  get OptionsClass(): new () => RemoveTrailingPunctuationInHeadingOptions {
    return RemoveTrailingPunctuationInHeadingOptions;
  }
  apply(text: string, options: RemoveTrailingPunctuationInHeadingOptions, protectedRanges: ProtectedRanges): string {
    const projection = protectedRanges.projection();
    const replacements: textReplacement[] = [];
    for (const match of projection.text.matchAll(allHeadersRegex)) {
      const headingText = match[4];
      // ignore the html entities and entries without any heading text
      if (headingText == '' || headingText.match(htmlEntitiesRegex)) {
        continue;
      }

      const trimmedHeaderText = headingText.trimEnd();
      // all of the trailing punctuation goes in one pass. Removing only the last character
      // meant a heading ending in several of them needed a lint per character, so the file
      // kept changing every time it was linted and lost a character each time.
      let endOfHeadingText = trimmedHeaderText.length;
      while (endOfHeadingText > 0 && options.punctuationToRemove.includes(trimmedHeaderText.charAt(endOfHeadingText - 1))) {
        endOfHeadingText--;
      }

      if (endOfHeadingText !== trimmedHeaderText.length) {
        // Only the punctuation is edited: a heading can span a projected multiline token.
        const startOfHeadingText = match.index + match[1].length + match[2].length + match[3].length;
        const range = projection.editRangeToSource({
          startIndex: startOfHeadingText + endOfHeadingText,
          endIndex: startOfHeadingText + trimmedHeaderText.length,
        });
        if (range) {
          replacements.push({...range, value: ''});
        }
      }
    }

    replacements.sort((a, b) => a.startIndex - b.startIndex || a.endIndex - b.endIndex);
    if (replacements.some((replacement, index) => index > 0 && replacement.startIndex < replacements[index - 1].endIndex)) {
      throw new Error('Rule replacements must be ordered and non-overlapping');
    }
    return replaceTextRanges(text, replacements);
  }

  get exampleBuilders(): ExampleBuilder<RemoveTrailingPunctuationInHeadingOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Removes punctuation from the end of a heading',
        before: dedent`
          # Heading ends in a period.
          ## Other heading ends in an exclamation mark! ##
        `,
        after: dedent`
          # Heading ends in a period
          ## Other heading ends in an exclamation mark ##
        `,
      }),
      new ExampleBuilder({
        description: 'HTML Entities at the end of a heading is ignored',
        before: dedent`
          # Heading 1
          ## Heading &amp;
        `,
        after: dedent`
          # Heading 1
          ## Heading &amp;
        `,
      }),
      new ExampleBuilder({ // accounts for https://github.com/platers/obsidian-linter/issues/851
        description: 'Removes punctuation from the end of a heading when followed by whitespace',
        before: dedent`
          # Heading 1!${'  '}
          ## Heading 2.\t
        `,
        after: dedent`
          # Heading 1${'  '}
          ## Heading 2\t
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<RemoveTrailingPunctuationInHeadingOptions>[] {
    return [
      new TextOptionBuilder({
        OptionsClass: RemoveTrailingPunctuationInHeadingOptions,
        nameKey: 'rules.remove-trailing-punctuation-in-heading.punctuation-to-remove.name',
        descriptionKey: 'rules.remove-trailing-punctuation-in-heading.punctuation-to-remove.description',
        optionsKey: 'punctuationToRemove',
      }),
    ];
  }
}
