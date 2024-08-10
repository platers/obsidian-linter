import {IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, MdFilePickerOptionBuilder, OptionBuilderBase, TextAreaOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {misspellingToCorrection} from '../utils/auto-correct-misspellings';
import {wordRegex, wordSplitterRegex} from '../utils/regex';
import {CustomAutoCorrectContent} from '../ui/linter-components/auto-correct-files-picker-option';

class AutoCorrectCommonMisspellingsOptions implements Options {
  ignoreWords?: string[] = [];
  extraAutoCorrectFiles?: CustomAutoCorrectContent[] = [];
}

@RuleBuilder.register
export default class AutoCorrectCommonMisspellings extends RuleBuilder<AutoCorrectCommonMisspellingsOptions> {
  constructor() {
    super({
      nameKey: 'rules.auto-correct-common-misspellings.name',
      descriptionKey: 'rules.auto-correct-common-misspellings.description',
      type: RuleType.CONTENT,
      ruleIgnoreTypes: [IgnoreTypes.yaml, IgnoreTypes.code, IgnoreTypes.inlineCode, IgnoreTypes.math, IgnoreTypes.inlineMath, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag, IgnoreTypes.image, IgnoreTypes.url],
    });
  }
  get OptionsClass(): new () => AutoCorrectCommonMisspellingsOptions {
    return AutoCorrectCommonMisspellingsOptions;
  }
  apply(text: string, options: AutoCorrectCommonMisspellingsOptions): string {
    return text.replaceAll(wordRegex, (word: string) => this.replaceWordWithCorrectCasing(word, options));
  }
  replaceWordWithCorrectCasing(word: string, options: AutoCorrectCommonMisspellingsOptions): string {
    const lowercasedWord = word.toLowerCase();
    if (options.ignoreWords.includes(lowercasedWord)) {
      return word;
    }

    if (misspellingToCorrection.has(lowercasedWord)) {
      return this.determineCorrectedWord(word, misspellingToCorrection.get(lowercasedWord));
    }

    if (options.extraAutoCorrectFiles) {
      for (let i = 0; i < options.extraAutoCorrectFiles.length; i++) {
        if (options.extraAutoCorrectFiles[i].customReplacements?.has(lowercasedWord)) {
          return this.determineCorrectedWord(word, options.extraAutoCorrectFiles[i].customReplacements?.get(lowercasedWord));
        }
      }
    }

    return word;
  }
  determineCorrectedWord(originalWord: string, replacement: string): string {
    if (originalWord.charAt(0) == originalWord.charAt(0).toUpperCase()) {
      replacement = replacement.charAt(0).toUpperCase() + replacement.substring(1);
    }

    return replacement;
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
      new MdFilePickerOptionBuilder({
        OptionsClass: AutoCorrectCommonMisspellingsOptions,
        nameKey: 'rules.auto-correct-common-misspellings.extra-auto-correct-files.name',
        descriptionKey: 'rules.auto-correct-common-misspellings.extra-auto-correct-files.description',
        // @ts-expect-error since it looks like there is an issue with the types here
        optionsKey: 'extraAutoCorrectFiles',
      }),
    ];
  }
}
