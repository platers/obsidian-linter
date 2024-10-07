import {IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, ExampleBuilder, MdFilePickerOptionBuilder, OptionBuilderBase, TextAreaOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {wordRegex, wordSplitterRegex} from '../utils/regex';
import {CustomAutoCorrectContent} from '../ui/linter-components/auto-correct-files-picker-option';

class AutoCorrectCommonMisspellingsOptions implements Options {
  ignoreWords?: string[] = [];
  extraAutoCorrectFiles?: CustomAutoCorrectContent[] = [];
  skipWordsWithMultipleCapitals?: boolean = false;
  @RuleBuilder.noSettingControl()
    misspellingToCorrection?: Map<string, string> = new Map();
}

@RuleBuilder.register
export default class AutoCorrectCommonMisspellings extends RuleBuilder<AutoCorrectCommonMisspellingsOptions> {
  constructor() {
    super({
      nameKey: 'rules.auto-correct-common-misspellings.name',
      descriptionKey: 'rules.auto-correct-common-misspellings.description',
      type: RuleType.CONTENT,
      // as a part of the logic to reduce the bundle and build size, we are moving the default list of replacements to
      // a markdown file outside of the plugin source. It will be stored in a map and should really only be passed into this
      // rule.
      hasSpecialExecutionOrder: true,
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
    if (options.ignoreWords.includes(lowercasedWord) || (options.skipWordsWithMultipleCapitals && word.length > 1 && lowercasedWord.substring(1) !== word.substring(1))) {
      return word;
    }

    if (options.misspellingToCorrection.has(lowercasedWord)) {
      return this.determineCorrectedWord(word, options.misspellingToCorrection.get(lowercasedWord));
    }

    if (options.extraAutoCorrectFiles) {
      for (let i = 0; i < options.extraAutoCorrectFiles.length; i++) {
        if (options.extraAutoCorrectFiles[i].customReplacements instanceof Map && options.extraAutoCorrectFiles[i].customReplacements?.has(lowercasedWord)) {
          return this.determineCorrectedWord(word, options.extraAutoCorrectFiles[i].customReplacements.get(lowercasedWord));
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
      new ExampleBuilder({
        description: 'Auto-correct misspellings skips words with multiple capital letters in them if `Skip Words with Multiple Capitals` is Enabled',
        before: dedent`
          HSA here will not be auto-corrected to Has since it has more than one capital letter.
          aADD will not be converted to add.
          But this also affects javaSrript(what should be JavaScript) and other proper names as well which will not be auto-corrected.
        `,
        after: dedent`
          HSA here will not be auto-corrected to Has since it has more than one capital letter.
          aADD will not be converted to add.
          But this also affects javaSrript(what should be JavaScript) and other proper names as well which will not be auto-corrected.
        `,
        options: {
          skipWordsWithMultipleCapitals: true,
        },
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
      new BooleanOptionBuilder({
        OptionsClass: AutoCorrectCommonMisspellingsOptions,
        nameKey: 'rules.auto-correct-common-misspellings.skip-words-with-multiple-capitals.name',
        descriptionKey: 'rules.auto-correct-common-misspellings.skip-words-with-multiple-capitals.description',
        optionsKey: 'skipWordsWithMultipleCapitals',
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
