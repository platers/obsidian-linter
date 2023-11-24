import {IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase, TextOptionBuilder} from './rule-builder';
import {ensureFencedCodeBlocksHasLanguage} from '../utils/mdast';
import dedent from 'ts-dedent';

class DefaultLanguageForCodeFencesOptions implements Options {
  defaultLanguage?: string = '';
}

@RuleBuilder.register
export default class DefaultLanguageForCodeFences extends RuleBuilder<DefaultLanguageForCodeFencesOptions> {
  constructor() {
    super({
      nameKey: 'rules.default-language-for-code-fences.name',
      descriptionKey: 'rules.default-language-for-code-fences.description',
      type: RuleType.CONTENT,
      ruleIgnoreTypes: [IgnoreTypes.yaml, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag],
    });
  }
  get OptionsClass(): new () => DefaultLanguageForCodeFencesOptions {
    return DefaultLanguageForCodeFencesOptions;
  }
  apply(text: string, options: DefaultLanguageForCodeFencesOptions): string {
    return ensureFencedCodeBlocksHasLanguage(text, options.defaultLanguage);
  }
  get exampleBuilders(): ExampleBuilder<DefaultLanguageForCodeFencesOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Add a default language `javascript` to code blocks that do not have a language specified',
        before: dedent`
          \`\`\`
          var temp = 'text';
          // this is a code block
          \`\`\`
        `,
        after: dedent`
          \`\`\`javascript
          var temp = 'text';
          // this is a code block
          \`\`\`
        `,
        options: {
          defaultLanguage: 'javascript',
        },
      }),
      new ExampleBuilder({
        description: 'If a code block already has a language specified, do not change it',
        before: dedent`
          \`\`\`javascript
          var temp = 'text';
          // this is a code block
          \`\`\`
        `,
        after: dedent`
          \`\`\`javascript
          var temp = 'text';
          // this is a code block
          \`\`\`
        `,
        options: {
          defaultLanguage: 'shell',
        },
      }),
      new ExampleBuilder({
        description: 'Empty string as the default language will not add a language to code blocks',
        before: dedent`
          \`\`\`
          var temp = 'text';
          // this is a code block
          \`\`\`
        `,
        after: dedent`
          \`\`\`
          var temp = 'text';
          // this is a code block
          \`\`\`
        `,
        options: {
          defaultLanguage: '',
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<DefaultLanguageForCodeFencesOptions>[] {
    return [
      new TextOptionBuilder({
        OptionsClass: DefaultLanguageForCodeFencesOptions,
        nameKey: 'rules.default-language-for-code-fences.default-language.name',
        descriptionKey: 'rules.default-language-for-code-fences.default-language.description',
        optionsKey: 'defaultLanguage',
      }),
    ];
  }
}
