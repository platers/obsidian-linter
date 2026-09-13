import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase, TextOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {IgnoreTypes} from '../utils/ignore-types';
import {updateBoldText, updateItalicsText} from '../utils/mdast';
import {collectUnprotectedRegexReplacements, LintContext, ProtectedRanges} from '../utils/protected-ranges';
import {escapeRegExp} from '../utils/regex';
import {replaceTextRanges, textReplacement} from '../utils/strings';

class SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbersOptions implements Options {
  englishNonLetterCharactersAfterCJKCharacters?: string = `-+'"([¥$`;
  englishNonLetterCharactersBeforeCJKCharacters?: string = `-+;:'"°%$)]`;
}

@RuleBuilder.register
export default class SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbers extends RuleBuilder<SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbersOptions> {
  constructor() {
    super({
      nameKey: 'rules.space-between-chinese-japanese-or-korean-and-english-or-numbers.name',
      descriptionKey: 'rules.space-between-chinese-japanese-or-korean-and-english-or-numbers.description',
      type: RuleType.SPACING,
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.inlineCode, IgnoreTypes.yaml, IgnoreTypes.image, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag, IgnoreTypes.math, IgnoreTypes.inlineMath, IgnoreTypes.html],
      usesProtectedRanges: true,
    });
  }
  get OptionsClass(): new () => SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbersOptions {
    return SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbersOptions;
  }
  apply(
      text: string,
      options: SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbersOptions,
      protectedRanges: ProtectedRanges,
  ): string {
    const head = this.buildHeadRegex(options.englishNonLetterCharactersAfterCJKCharacters);
    const tail = this.buildTailRegex(options.englishNonLetterCharactersBeforeCJKCharacters);
    // inline math, inline code, markdown links, and wiki links are an exception in that even though they are to be ignored we want to keep a space around these types when surrounded by CJK characters
    // Reuse the document's cached context for this narrower set, rather than rebuilding its ranges.
    const ignoreExceptions = LintContext.for(text).protectedRangesFor([IgnoreTypes.link, IgnoreTypes.inlineMath, IgnoreTypes.inlineCode, IgnoreTypes.wikiLink]);
    const addSpaceAroundChineseJapaneseKoreanAndEnglish = (content: string, offset: number, ranges: ProtectedRanges): textReplacement[] => {
      const replacements: textReplacement[] = [];
      for (const regex of [head, tail]) {
        replacements.push(...collectUnprotectedRegexReplacements(content, regex, ranges, {
          editRange: (match, startIndex) => ({
            startIndex: startIndex + match[1].length,
            endIndex: startIndex + match[0].length - match[3].length,
            value: ' ',
          }),
          guardRange: (match, startIndex) => ({startIndex, endIndex: startIndex + match[0].length}),
        }, offset));
      }
      return replacements;
    };

    const replacements = addSpaceAroundChineseJapaneseKoreanAndEnglish(text, 0, protectedRanges.combinedWith([IgnoreTypes.italics, IgnoreTypes.bold]));
    const cjkBefore = /[\p{sc=Han}\p{sc=Katakana}\p{sc=Hiragana}\p{sc=Hangul}]( *)$/u;
    const cjkAfter = /^( *)[\p{sc=Han}\p{sc=Katakana}\p{sc=Hiragana}\p{sc=Hangul}]/u;
    for (const range of ignoreExceptions.ranges) {
      let startIndex = range.startIndex;
      while (startIndex > 0 && text.charAt(startIndex - 1) === ' ') {
        startIndex--;
      }
      const before = text.substring(Math.max(0, startIndex - 2), range.startIndex).match(cjkBefore);
      if (before && !protectedRanges.isProtected(range.startIndex - before[0].length, range.startIndex)) {
        replacements.push({startIndex, endIndex: range.startIndex, value: ' '});
      }

      let endIndex = range.endIndex;
      while (endIndex < text.length && text.charAt(endIndex) === ' ') {
        endIndex++;
      }
      const after = text.substring(range.endIndex, endIndex + 2).match(cjkAfter);
      if (after && !protectedRanges.isProtected(range.endIndex, range.endIndex + after[0].length)) {
        replacements.push({startIndex: range.endIndex, endIndex, value: ' '});
      }
    }

    replacements.push(...updateItalicsText(text, addSpaceAroundChineseJapaneseKoreanAndEnglish, protectedRanges));
    replacements.push(...updateBoldText(text, addSpaceAroundChineseJapaneseKoreanAndEnglish, protectedRanges));

    // Nested emphasis and bold may discover the same whitespace edit. Apply that edit only once.
    replacements.sort((a, b) => a.startIndex - b.startIndex || a.endIndex - b.endIndex);
    const uniqueReplacements = replacements.filter((replacement, index) => {
      const previous = replacements[index - 1];
      return !previous || replacement.startIndex !== previous.startIndex || replacement.endIndex !== previous.endIndex;
    });
    return replaceTextRanges(text, uniqueReplacements);
  }
  buildHeadRegex(englishPunctuationAndSymbols: string): RegExp {
    if (englishPunctuationAndSymbols && englishPunctuationAndSymbols !== '') {
      // strip all whitespace
      englishPunctuationAndSymbols =englishPunctuationAndSymbols.replaceAll(/\s/g, '');
    }

    let puncAndSymbolGroup = '';
    if (englishPunctuationAndSymbols && englishPunctuationAndSymbols.length != 0) {
      puncAndSymbolGroup = `|[${escapeRegExp(englishPunctuationAndSymbols)}]`;
    }

    return new RegExp(`(\\p{sc=Han}|\\p{sc=Katakana}|\\p{sc=Hiragana}|\\p{sc=Hangul})( *)(\\[[^[]*\\]\\(.*\\)|\`[^\`]*\`|\\w+${puncAndSymbolGroup}|\\*[^*])`, 'gmu');
  }
  buildTailRegex(englishPunctuationAndSymbols: string): RegExp {
    if (englishPunctuationAndSymbols && englishPunctuationAndSymbols !== '') {
      // strip all whitespace
      englishPunctuationAndSymbols =englishPunctuationAndSymbols.replaceAll(/\s/g, '');
    }

    let puncAndSymbolGroup = '';
    if (englishPunctuationAndSymbols && englishPunctuationAndSymbols.length != 0) {
      puncAndSymbolGroup = `|[${escapeRegExp(englishPunctuationAndSymbols)}]`;
    }

    return new RegExp(`(\\[[^[]*\\]\\(.*\\)|\`[^\`]*\`|\\w+${puncAndSymbolGroup}|[^*]\\*)( *)(\\p{sc=Han}|\\p{sc=Katakana}|\\p{sc=Hiragana}|\\p{sc=Hangul})`, 'gmu');
  }
  get exampleBuilders(): ExampleBuilder<SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbersOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Space between Chinese and English',
        before: dedent`
          中文字符串english中文字符串。
        `,
        after: dedent`
          中文字符串 english 中文字符串。
        `,
      }),
      new ExampleBuilder({
        description: 'Space between Chinese and link',
        before: dedent`
          中文字符串[english](http://example.com)中文字符串。
        `,
        after: dedent`
          中文字符串 [english](http://example.com) 中文字符串。
        `,
      }),
      new ExampleBuilder({
        description: 'Space between Chinese and inline code block',
        before: dedent`
          中文字符串\`code\`中文字符串。
        `,
        after: dedent`
          中文字符串 \`code\` 中文字符串。
        `,
      }),
      new ExampleBuilder({
        // accounts for https://github.com/platers/obsidian-linter/issues/234
        description: 'No space between Chinese and English in tag',
        before: dedent`
          #标签A #标签2标签
        `,
        after: dedent`
          #标签A #标签2标签
        `,
      }),
      new ExampleBuilder({
        // accounts for https://github.com/platers/obsidian-linter/issues/301
        description:
          'Make sure that spaces are not added between italics and Chinese characters to preserve markdown syntax',
        before: dedent`
          _这是一个数学公式_
          *这是一个数学公式english*
          ${''}
          # Handling bold and italics nested in each other is not supported at this time
          ${''}
          **_这是一_个数学公式**
          *这是一hello__个数学world公式__*
        `,
        after: dedent`
          _这是一个数学公式_
          *这是一个数学公式 english*
          ${''}
          # Handling bold and italics nested in each other is not supported at this time
          ${''}
          **_ 这是一 _ 个数学公式**
          *这是一 hello__ 个数学 world 公式 __*
        `,
      }),
      new ExampleBuilder({
        // accounts for https://github.com/platers/obsidian-linter/issues/302
        description: 'Images and links are ignored',
        before: dedent`
          [[这是一个数学公式english]]
          ![[这是一个数学公式english.jpg]]
          [这是一个数学公式english](这是一个数学公式english.md)
          ![这是一个数学公式english](这是一个数学公式english.jpg)
        `,
        after: dedent`
          [[这是一个数学公式english]]
          ![[这是一个数学公式english.jpg]]
          [这是一个数学公式english](这是一个数学公式english.md)
          ![这是一个数学公式english](这是一个数学公式english.jpg)
        `,
      }),
      new ExampleBuilder({
        description: 'Space between CJK and English',
        before: dedent`
          日本語englishひらがな
          カタカナenglishカタカナ
          ﾊﾝｶｸｶﾀｶﾅenglish１２３全角数字
          한글english한글
        `,
        after: dedent`
          日本語 english ひらがな
          カタカナ english カタカナ
          ﾊﾝｶｸｶﾀｶﾅ english１２３全角数字
          한글 english 한글
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbersOptions>[] {
    return [
      new TextOptionBuilder({
        OptionsClass: SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbersOptions,
        nameKey: 'rules.space-between-chinese-japanese-or-korean-and-english-or-numbers.english-symbols-punctuation-before.name',
        descriptionKey: 'rules.space-between-chinese-japanese-or-korean-and-english-or-numbers.english-symbols-punctuation-before.description',
        optionsKey: 'englishNonLetterCharactersBeforeCJKCharacters',
      }),
      new TextOptionBuilder({
        OptionsClass: SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbersOptions,
        nameKey: 'rules.space-between-chinese-japanese-or-korean-and-english-or-numbers.english-symbols-punctuation-after.name',
        descriptionKey: 'rules.space-between-chinese-japanese-or-korean-and-english-or-numbers.english-symbols-punctuation-after.description',
        optionsKey: 'englishNonLetterCharactersAfterCJKCharacters',
      }),
    ];
  }
}
