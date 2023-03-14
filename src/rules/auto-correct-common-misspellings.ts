import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase, TextAreaOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {misspellingToCorrection} from '../utils/auto-correct-misspellings';
import {wordSplitterRegex} from '../utils/regex';

class AutoCorrectCommonMisspellingsOptions implements Options {
  ignoreWords?: string[] = [];
}

@RuleBuilder.register
export default class AutoCorrectCommonMisspellings extends RuleBuilder<AutoCorrectCommonMisspellingsOptions> {
  constructor() {
    super({
      nameKey: 'rules.auto-correct-common-misspellings.name',
      descriptionKey: 'rules.auto-correct-common-misspellings.description',
      type: RuleType.CONTENT,
    });
  }
  get OptionsClass(): new () => AutoCorrectCommonMisspellingsOptions {
    return AutoCorrectCommonMisspellingsOptions;
  }
  apply(text: string, options: AutoCorrectCommonMisspellingsOptions): string {
    return ignoreListOfTypes([IgnoreTypes.yaml, IgnoreTypes.code, IgnoreTypes.inlineCode, IgnoreTypes.math, IgnoreTypes.inlineMath, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag, IgnoreTypes.image, IgnoreTypes.url], text, (text) => {
      const wordRegex = /[\p{L}\p{N}\p{Pc}\p{M}\-'’`]+/gu;

      return text.replaceAll(wordRegex, (word: string) => {
        const lowercasedWord = word.toLowerCase();
        if (!misspellingToCorrection.has(lowercasedWord) || options.ignoreWords.includes(lowercasedWord)) {
          return word;
        }

        let correctedWord = misspellingToCorrection.get(lowercasedWord);
        if (word.charAt(0) == word.charAt(0).toUpperCase()) {
          correctedWord = correctedWord.charAt(0).toUpperCase() + correctedWord.substring(1);
        }

        return correctedWord;
      });
    });
  }
  get exampleBuilders(): ExampleBuilder<AutoCorrectCommonMisspellingsOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Auto-correct misspellings in regular text, but not code blocks, math blocks, YAML, or tags',
        before: dedent`
          ---
          key: absoltely
          ---
          ${''}
          I absoltely hate when my codeblocks get formatted when they should not be.
          ${''}
          \`\`\`
          # comments absoltely can be helpful, but they can also be misleading
          \`\`\`
          ${''}
          Note that inline code also has the applicable spelling errors ignored: \`absoltely\` 
          ${''}
          $$
          Math block absoltely does not get auto-corrected.
          $$
          ${''}
          The same $ defenately $ applies to inline math.
          ${''}
          #defenately stays the same
        `,
        after: dedent`
          ---
          key: absoltely
          ---
          ${''}
          I absolutely hate when my codeblocks get formatted when they should not be.
          ${''}
          \`\`\`
          # comments absoltely can be helpful, but they can also be misleading
          \`\`\`
          ${''}
          Note that inline code also has the applicable spelling errors ignored: \`absoltely\` 
          ${''}
          $$
          Math block absoltely does not get auto-corrected.
          $$
          ${''}
          The same $ defenately $ applies to inline math.
          ${''}
          #defenately stays the same
        `,
      }),
      new ExampleBuilder({
        description: 'Auto-correct misspellings keeps first letter\'s case',
        before: dedent`
          Accodringly we made sure to update logic to make sure it would handle case sensitivity.
        `,
        after: dedent`
          Accordingly we made sure to update logic to make sure it would handle case sensitivity.
        `,
      }),
      new ExampleBuilder({
        description: 'Links should not be auto-corrected',
        before: dedent`
          http://www.Absoltely.com should not be corrected
        `,
        after: dedent`
          http://www.Absoltely.com should not be corrected
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<AutoCorrectCommonMisspellingsOptions>[] {
    return [
      new TextAreaOptionBuilder({
        OptionsClass: AutoCorrectCommonMisspellingsOptions,
        nameKey: 'rules.auto-correct-common-misspellings.ignore-words.name',
        descriptionKey: 'rules.auto-correct-common-misspellings.ignore-words.description',
        optionsKey: 'ignoreWords',
        splitter: wordSplitterRegex,
        separator: ', ',
      }),
    ];
  }
}
