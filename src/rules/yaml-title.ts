import {Options, RuleType} from '../rules';
import RuleBuilder, {DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase, TextOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {formatYAML, initYAML, toYamlString} from '../utils/yaml';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {escapeDollarSigns} from '../utils/regex';
import {insert} from '../utils/strings';

type yamlTitleEscapeOptions = 'None' | 'Single Quote' | 'Double Quote';

class YamlTitleOptions implements Options {
  @RuleBuilder.noSettingControl()
    fileName: string;

  titleKey?: string = 'title';
  yamlEscapeCharacter?: yamlTitleEscapeOptions = 'None';
}

@RuleBuilder.register
export default class YamlTitle extends RuleBuilder<YamlTitleOptions> {
  get OptionsClass(): new () => YamlTitleOptions {
    return YamlTitleOptions;
  }
  get name(): string {
    return 'YAML Title';
  }
  get description(): string {
    return 'Inserts the title of the file into the YAML frontmatter. Gets the title from the first H1 or filename if there is no H1.';
  }
  get type(): RuleType {
    return RuleType.YAML;
  }
  apply(text: string, options: YamlTitleOptions): string {
    text = initYAML(text);
    let title = ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
      const result = text.match(/^#\s+(.*)/m);
      if (result) {
        return result[1];
      }
      return '';
    });

    title = title || options.fileName;

    title = toYamlString(title);

    const ensureSpecifiedCharacterStartsTitleIfNotAlreadyEscaped = function(title: string, characterToStartAndEndWith: string, otherEscapeCharacter: string) {
      if ((title.startsWith(otherEscapeCharacter) && title.endsWith(otherEscapeCharacter)) ||
      (title.startsWith(characterToStartAndEndWith) && title.endsWith(characterToStartAndEndWith))) {
        return title;
      }

      return characterToStartAndEndWith + title + characterToStartAndEndWith;
    };

    if (options.yamlEscapeCharacter == 'Single Quote') {
      title = ensureSpecifiedCharacterStartsTitleIfNotAlreadyEscaped(title, '\'', '"');
    } else if (options.yamlEscapeCharacter == 'Double Quote') {
      title = ensureSpecifiedCharacterStartsTitleIfNotAlreadyEscaped(title, '"', '\'');
    }

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
    ];
  }
  get optionBuilders(): OptionBuilderBase<YamlTitleOptions>[] {
    return [
      new TextOptionBuilder({
        OptionsClass: YamlTitleOptions,
        name: 'Title Key',
        description: 'Which YAML key to use for title',
        optionsKey: 'titleKey',
      }),
      new DropdownOptionBuilder({
        OptionsClass: YamlTitleOptions,
        name: 'Yaml Escape Character',
        description: 'Specifies what character to put around the Title Key Yaml value if it has not already been escaped',
        optionsKey: 'yamlEscapeCharacter',
        records: [
          {
            value: 'None',
            description: 'title: Title Here',
          },
          {
            value: 'Single Quote',
            description: 'title: \'Title Here\'',
          },
          {
            value: 'Double Quote',
            description: 'title: "Title Here"',
          },
        ],
      }),
    ];
  }
}
