import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {updateBoldText, updateItalicsText} from '../utils/mdast';

class SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbersOptions implements Options {}

@RuleBuilder.register
export default class SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbers extends RuleBuilder<SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbersOptions> {
  constructor() {
    super({
      nameKey: 'rules.space-between-chinese-japanese-or-korean-and-english-or-numbers.name',
      descriptionKey: 'rules.space-between-chinese-japanese-or-korean-and-english-or-numbers.description',
      type: RuleType.SPACING,
    });
  }
  get OptionsClass(): new () => SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbersOptions {
    return SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbersOptions;
  }
  apply(
      text: string,
      options: SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbersOptions,
  ): string {
    const head =
      /(\p{sc=Han}|\p{sc=Katakana}|\p{sc=Hiragana}|\p{sc=Hangul})( *)(\[[^[]*\]\(.*\)|`[^`]*`|\w+|[-+'"([{¥$]|\*[^*])/gmu;
    const tail =
      /(\[[^[]*\]\(.*\)|`[^`]*`|\w+|[-+;:'"°%$)\]}]|[^*]\*)( *)(\p{sc=Han}|\p{sc=Katakana}|\p{sc=Hiragana}|\p{sc=Hangul})/gmu;
    const addSpaceAroundChineseJapaneseKoreanAndEnglish = function(
        text: string,
    ): string {
      return text.replace(head, '$1 $3').replace(tail, '$1 $3');
    };


    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.inlineCode, IgnoreTypes.yaml, IgnoreTypes.image, IgnoreTypes.link,
      IgnoreTypes.wikiLink, IgnoreTypes.tag, IgnoreTypes.math, IgnoreTypes.inlineMath], text, (text: string) => {
      let newText = ignoreListOfTypes([IgnoreTypes.italics, IgnoreTypes.bold], text, addSpaceAroundChineseJapaneseKoreanAndEnglish);

      newText = updateItalicsText(
          newText,
          addSpaceAroundChineseJapaneseKoreanAndEnglish,
      );

      newText = updateBoldText(
          newText,
          addSpaceAroundChineseJapaneseKoreanAndEnglish,
      );
      return newText;
    });
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
          'Make sure that spaces are not added between italics and chinese characters to preserve markdown syntax',
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
    return [];
  }
}
