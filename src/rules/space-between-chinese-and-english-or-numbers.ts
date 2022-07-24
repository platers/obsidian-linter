import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';

class SpaceBetweenChineseAndEnglishOrNumbersOptions implements Options {
}

@RuleBuilder.register
export default class SpaceBetweenChineseAndEnglishOrNumbers extends RuleBuilder<SpaceBetweenChineseAndEnglishOrNumbersOptions> {
  get OptionsClass(): new () => SpaceBetweenChineseAndEnglishOrNumbersOptions {
    return SpaceBetweenChineseAndEnglishOrNumbersOptions;
  }
  get name(): string {
    return 'Space between Chinese and English or numbers';
  }
  get description(): string {
    return 'Ensures that Chinese and English or numbers are separated by a single space. Follow this [guidelines](https://github.com/sparanoid/chinese-copywriting-guidelines)';
  }
  get type(): RuleType {
    return RuleType.SPACING;
  }
  apply(text: string, options: SpaceBetweenChineseAndEnglishOrNumbersOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
      const head = /([\u4e00-\u9fa5])( *)(\[[^[]*\]\(.*\)|`[^`]*`|\w+|[-+'"([{¥$]|\*[^*])/gm;
      const tail = /(\[[^[]*\]\(.*\)|`[^`]*`|\w+|[-+;:'"°%)\]}]|[^*]\*)( *)([\u4e00-\u9fa5])/gm;
      return text.replace(head, '$1 $3').replace(tail, '$1 $3');
    });
  }
  get exampleBuilders(): ExampleBuilder<SpaceBetweenChineseAndEnglishOrNumbersOptions>[] {
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
    ];
  }
  get optionBuilders(): OptionBuilderBase<SpaceBetweenChineseAndEnglishOrNumbersOptions>[] {
    return [];
  }
}
