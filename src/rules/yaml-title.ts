import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase, TextOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {escapeStringIfNecessaryAndPossible, formatYAML, initYAML, QuoteCharacter} from '../utils/yaml';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {escapeDollarSigns, getFirstHeaderOneText} from '../utils/regex';
import {insert} from '../utils/strings';

class YamlTitleOptions implements Options {
  @RuleBuilder.noSettingControl()
    fileName: string;

  @RuleBuilder.noSettingControl()
    defaultEscapeCharacter?: QuoteCharacter = '"';

  titleKey?: string = 'title';
}

@RuleBuilder.register
export default class YamlTitle extends RuleBuilder<YamlTitleOptions> {
  constructor() {
    super({
      nameKey: 'rules.yaml-title.name',
      descriptionKey: 'rules.yaml-title.description',
      type: RuleType.YAML,
    });
  }
  get OptionsClass(): new () => YamlTitleOptions {
    return YamlTitleOptions;
  }
  apply(text: string, options: YamlTitleOptions): string {
    text = initYAML(text);
    let title = ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.tag], text, getFirstHeaderOneText);
    title = title || options.fileName;

    title = escapeStringIfNecessaryAndPossible(title, options.defaultEscapeCharacter);

    return formatYAML(text, (text) => {
      const title_match_str = `\n${options.titleKey}.*\n`;
      const title_match = new RegExp(title_match_str);
      if (title_match.test(text)) {
        text = text.replace(
            title_match,
            escapeDollarSigns(`\n${options.titleKey}: ${title}\n`),
        );
      } else {
        const yaml_end = text.indexOf('\n---');
        text = insert(text, yaml_end, `\n${options.titleKey}: ${title}`);
      }

      return text;
    });
  }
  get exampleBuilders(): ExampleBuilder<YamlTitleOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Adds a header with the title from heading.',
        before: dedent`
          # Obsidian
        `,
        after: dedent`
          ---
          title: Obsidian
          ---
          # Obsidian
        `,
        options: {
          fileName: 'Filename',
        },
      }),
      new ExampleBuilder({
        description: 'Adds a header with the title.',
        before: dedent`
          ${''}
        `,
        after: dedent`
          ---
          title: Filename
          ---
          ${''}
        `,
        options: {
          fileName: 'Filename',
        },
      }),
      new ExampleBuilder({ // accounts for https://github.com/platers/obsidian-linter/issues/470
        description: 'Make sure that markdown links in headings are properly copied to the yaml as just the text',
        before: dedent`
          # This is a [Heading](test heading.md)
        `,
        after: dedent`
          ---
          title: This is a Heading
          ---
          # This is a [Heading](test heading.md)
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<YamlTitleOptions>[] {
    return [
      new TextOptionBuilder({
        OptionsClass: YamlTitleOptions,
        nameKey: 'rules.yaml-title.title-key.name',
        descriptionKey: 'rules.yaml-title.title-key.description',
        optionsKey: 'titleKey',
      }),
    ];
  }
}
