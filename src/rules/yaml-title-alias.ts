import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {getYamlSectionValue, initYAML, loadYAML, removeYamlSection, setYamlSection, toSingleLineArrayYamlString, toYamlString} from '../utils/yaml';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {yamlRegex} from '../utils/regex';

type YamlAliasesSectionStyle =
  'Multi-line array' |
  'Single-line array' |
  'Single string that expands to multi-line array if needed' |
  'Single string that expands to single-line array if needed';

type YamlAliasesSectionResultStyle =
  'Remove' |
  'Multi-line array' |
  'Single-line array' |
  'Single string';

class YamlTitleAliasOptions implements Options {
  yamlAliasesSectionStyle?: YamlAliasesSectionStyle = 'Multi-line array';
  preserveExistingAliasesSectionStyle?: boolean = true;
  keepAliasThatMatchesTheFilename?: boolean = false;

  @RuleBuilder.noSettingControl()
    fileName?: string;
}

@RuleBuilder.register
export default class YamlTitleAlias extends RuleBuilder<YamlTitleAliasOptions> {
  get OptionsClass(): new () => YamlTitleAliasOptions {
    return YamlTitleAliasOptions;
  }
  get name(): string {
    return 'YAML Title Alias';
  }
  get description(): string {
    return 'Inserts the title of the file into the YAML frontmatter\'s aliases section. Gets the title from the first H1 or filename.';
  }
  get type(): RuleType {
    return RuleType.YAML;
  }
  apply(text: string, options: YamlTitleAliasOptions): string {
    const ALIASES_YAML_SECTION_NAME = 'aliases';
    const LINTER_ALIASES_HELPER_NAME = 'linter-yaml-title-alias';

    text = initYAML(text);
    let title = ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
      const result = text.match(/^#\s+(.*)/m);
      if (result) {
        return result[1];
      }
      return '';
    });
    title = title || options.fileName;

    const shouldRemoveTitleAlias = !options.keepAliasThatMatchesTheFilename && title === options.fileName;

    let yaml = text.match(yamlRegex)[1];

    let previousTitle = loadYAML(getYamlSectionValue(yaml, LINTER_ALIASES_HELPER_NAME));

    let requiresChanges = true;

    if (previousTitle === title && !shouldRemoveTitleAlias) {
      requiresChanges = false;
    }

    if (previousTitle === null && shouldRemoveTitleAlias) {
      requiresChanges = false;
    }

    if (!requiresChanges && options.preserveExistingAliasesSectionStyle) {
      return text;
    }

    let aliasesValue = getYamlSectionValue(yaml, ALIASES_YAML_SECTION_NAME);

    if (!aliasesValue) {
      if (shouldRemoveTitleAlias) {
        return text;
      }

      let emptyValue;
      switch (options.yamlAliasesSectionStyle) {
        case 'Multi-line array':
          emptyValue = '\n  - \'\'';
          break;
        case 'Single-line array':
          emptyValue = ' [\'\']';
          break;
        case 'Single string that expands to multi-line array if needed':
        case 'Single string that expands to single-line array if needed':
          emptyValue = ' \'\'';
          break;
        default:
          throw new Error(`Unsupported setting 'YAML aliases section style': ${options.yamlAliasesSectionStyle}`);
      }

      let newYaml = yaml;
      newYaml = setYamlSection(newYaml, ALIASES_YAML_SECTION_NAME, emptyValue);
      newYaml = setYamlSection(newYaml, LINTER_ALIASES_HELPER_NAME, ' \'\'');

      text = text.replace(`---\n${yaml}---`, `---\n${newYaml}---`);
      yaml = newYaml;
      aliasesValue = getYamlSectionValue(yaml, ALIASES_YAML_SECTION_NAME);
      previousTitle = '';
    }

    const isMultiline = aliasesValue.includes('\n');
    const parsedAliases = loadYAML(aliasesValue);

    const isSingleString = !isMultiline && aliasesValue.match(/^\[.*\]/) === null;

    let resultAliasesArray = isSingleString ? [parsedAliases] : [...parsedAliases];

    const previousTitleIndex = resultAliasesArray.indexOf(previousTitle);
    if (previousTitleIndex !== -1) {
      if (shouldRemoveTitleAlias) {
        resultAliasesArray.splice(previousTitleIndex, 1);
      } else {
        resultAliasesArray[previousTitleIndex] = title;
      }
    } else if (!shouldRemoveTitleAlias) {
      resultAliasesArray = [title, ...resultAliasesArray];
    }

    if (!requiresChanges) {
      switch (options.yamlAliasesSectionStyle) {
        case 'Multi-line array':
          if (isMultiline) {
            return text;
          }
          break;
        case 'Single-line array':
          if (!isMultiline && !isSingleString) {
            return text;
          }
          break;
        case 'Single string that expands to multi-line array if needed':
          if (isSingleString) {
            return text;
          }
          if (isMultiline && resultAliasesArray.length > 1) {
            return text;
          }
          break;
        case 'Single string that expands to single-line array if needed':
          if (isSingleString) {
            return text;
          }
          if (!isMultiline && resultAliasesArray.length > 1) {
            return text;
          }
          break;
      }
    }

    let resultStyle: YamlAliasesSectionResultStyle;

    if (resultAliasesArray.length === 0) {
      resultStyle = 'Remove';
    } else if (!options.preserveExistingAliasesSectionStyle) {
      switch (options.yamlAliasesSectionStyle) {
        case 'Multi-line array':
          resultStyle = 'Multi-line array';
          break;
        case 'Single-line array':
          resultStyle = 'Single-line array';
          break;
        case 'Single string that expands to multi-line array if needed':
          if (resultAliasesArray.length === 1) {
            resultStyle = 'Single string';
          } else {
            resultStyle = 'Multi-line array';
          }
          break;
        case 'Single string that expands to single-line array if needed':
          if (resultAliasesArray.length === 1) {
            resultStyle = 'Single string';
          } else {
            resultStyle = 'Single-line array';
          }
          break;
      }
    } else if (isSingleString) {
      if (resultAliasesArray.length === 1) {
        resultStyle = 'Single string';
      } else {
        switch (options.yamlAliasesSectionStyle) {
          case 'Multi-line array':
          case 'Single string that expands to multi-line array if needed':
            resultStyle = 'Multi-line array';
            break;
          case 'Single-line array':
          case 'Single string that expands to single-line array if needed':
            resultStyle = 'Single-line array';
            break;
        }
      }
    } else if (isMultiline) {
      resultStyle = 'Multi-line array';
    } else {
      resultStyle = 'Single-line array';
    }

    let newAliasesYaml;

    switch (resultStyle) {
      case 'Remove':
        break;
      case 'Multi-line array':
        newAliasesYaml = `\n${toYamlString(resultAliasesArray)}`.replace(/\n-/g, '\n  -');
        break;
      case 'Single-line array':
        newAliasesYaml = ` ${toSingleLineArrayYamlString(resultAliasesArray)}`;
        break;
      case 'Single string':
        newAliasesYaml = resultAliasesArray.length === 0 ? '' : ` ${toYamlString(resultAliasesArray[0])}`;
        break;
      default:
        throw new Error(`Unsupported resultStyle: ${resultStyle}`);
    }

    let newYaml = yaml;

    if (resultStyle === 'Remove') {
      newYaml = removeYamlSection(newYaml, ALIASES_YAML_SECTION_NAME);
    } else {
      newYaml = setYamlSection(newYaml, ALIASES_YAML_SECTION_NAME, newAliasesYaml);
    }

    if (shouldRemoveTitleAlias) {
      newYaml = removeYamlSection(newYaml, LINTER_ALIASES_HELPER_NAME);
    } else {
      newYaml = setYamlSection(newYaml, LINTER_ALIASES_HELPER_NAME, ` ${toYamlString(title)}`);
    }

    text = text.replace(yaml, newYaml);

    return text;
  }
  get exampleBuilders(): ExampleBuilder<YamlTitleAliasOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Adds a header with the title from heading.',
        before: dedent`
          # Obsidian
        `,
        after: dedent`
          ---
          aliases:
            - Obsidian
          linter-yaml-title-alias: Obsidian
          ---
          # Obsidian
        `,
      }),
      new ExampleBuilder({
        description: 'Adds a header with the title.',
        before: dedent`
          ${''}
        `,
        after: dedent`
          ---
          aliases:
            - Filename
          linter-yaml-title-alias: Filename
          ---
          ${''}
        `,
        options: {
          fileName: 'Filename',
          keepAliasThatMatchesTheFilename: true,
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<YamlTitleAliasOptions>[] {
    return [
      new DropdownOptionBuilder<YamlTitleAliasOptions, YamlAliasesSectionStyle>({
        OptionsClass: YamlTitleAliasOptions,
        name: 'YAML aliases section style',
        description: 'The style of the aliases YAML section',
        optionsKey: 'yamlAliasesSectionStyle',
        records: [
          {
            value: 'Multi-line array',
            description: '```aliases:\\n  - Title```',
          },
          {
            value: 'Single-line array',
            description: '```aliases: [Title]```',
          },
          {
            value: 'Single string that expands to multi-line array if needed',
            description: '```aliases: Title```',
          },
          {
            value: 'Single string that expands to single-line array if needed',
            description: '```aliases: Title```',
          },
        ],
      }),
      new BooleanOptionBuilder({
        OptionsClass: YamlTitleAliasOptions,
        name: 'Preserve existing aliases section style',
        description: 'If set, the `YAML aliases section style` setting applies only to the newly created sections',
        optionsKey: 'preserveExistingAliasesSectionStyle',
      }),
      new BooleanOptionBuilder({
        OptionsClass: YamlTitleAliasOptions,
        name: 'Keep alias that matches the filename',
        description: 'Such aliases are usually redundant',
        optionsKey: 'keepAliasThatMatchesTheFilename',
      }),
    ];
  }
}
