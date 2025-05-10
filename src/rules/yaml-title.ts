import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase, TextOptionBuilder, DropdownOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {escapeStringIfNecessaryAndPossible, formatYAML, initYAML, QuoteCharacter} from '../utils/yaml';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {escapeDollarSigns, getFirstHeaderOneText} from '../utils/regex';
import {insert} from '../utils/strings';

type YamlTitleModeValues = 'first-h1-or-filename-if-h1-missing' | 'filename' | 'first-h1';

class YamlTitleOptions implements Options {
  @RuleBuilder.noSettingControl()
    fileName: string;

  @RuleBuilder.noSettingControl()
    defaultEscapeCharacter?: QuoteCharacter = '"';

  titleKey?: string = 'title';

  mode?: YamlTitleModeValues = 'first-h1-or-filename-if-h1-missing';
}

@RuleBuilder.register
export default class YamlTitle extends RuleBuilder<YamlTitleOptions> {
  constructor() {
    super({
      nameKey: 'rules.yaml-title.name',
      descriptionKey: 'rules.yaml-title.description',
      type: RuleType.YAML,
      hasSpecialExecutionOrder: true, // this rule must run after capitalize-headings in order to update the title correctly
    });
  }
  get OptionsClass(): new () => YamlTitleOptions {
    return YamlTitleOptions;
  }
  apply(text: string, options: YamlTitleOptions): string {
    text = initYAML(text);
    let title = '';
    switch (options.mode) {
      case 'filename':
        title = options.fileName;
        break;
      case 'first-h1':
        title = this.getFirstH1Header(text);
        break;
      default:
        title = this.getFirstH1Header(text);
        title = title || options.fileName;
    }

    title = escapeStringIfNecessaryAndPossible(title, options.defaultEscapeCharacter);

    return formatYAML(text, (text) => {
      const title_match_str = `\n${options.titleKey}:.*\n`;
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
  getFirstH1Header(text: string): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.tag], text, getFirstHeaderOneText);
  }
  get exampleBuilders(): ExampleBuilder<YamlTitleOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Adds a header with the title from heading when `mode = \'First H1 or Filename if H1 Missing\'`.',
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
        description: 'Adds a header with the title when `mode = \'First H1 or Filename if H1 Missing\'`.',
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
        description: 'Make sure that markdown links in headings are properly copied to the YAML as just the text when `mode = \'First H1 or Filename if H1 Missing\'`',
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
      new ExampleBuilder({
        description: 'When `mode = \'First H1\'`, title does not have a value if no H1 is present',
        before: dedent`
          ## This is a Heading
        `,
        after: dedent`
          ---
          title: ""
          ---
          ## This is a Heading
        `,
        options: {
          mode: 'first-h1',
          fileName: 'Filename',
        },
      }),
      new ExampleBuilder({
        description: 'When `mode = \'Filename\'`, title uses the filename ignoring all H1s. Note: the filename is "Filename" in this example.',
        before: dedent`
          # This is a Heading
        `,
        after: dedent`
          ---
          title: Filename
          ---
          # This is a Heading
        `,
        options: {
          mode: 'filename',
          fileName: 'Filename',
        },
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
      new DropdownOptionBuilder<YamlTitleOptions, YamlTitleModeValues>({
        OptionsClass: YamlTitleOptions,
        nameKey: 'rules.yaml-title.mode.name',
        descriptionKey: 'rules.yaml-title.mode.description',
        optionsKey: 'mode',
        records: [
          {
            value: 'first-h1-or-filename-if-h1-missing',
            description: 'Uses the first H1 in the file or the filename of the file if there is not H1',
          },
          {
            value: 'filename',
            description: 'Uses the filename as the title',
          },
          {
            value: 'first-h1',
            description: 'Uses the first H1 in the file as the title',
          },
        ],
      }),
    ];
  }
}
