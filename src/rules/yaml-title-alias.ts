import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, ExampleBuilder, OptionBuilderBase, TextOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {convertAliasValueToStringOrStringArray, escapeStringIfNecessaryAndPossible, formatYamlArrayValue, getYamlSectionValue, initYAML, DEFAULT_LINTER_ALIASES_HELPER_KEY, loadYAML, NormalArrayFormats, OBSIDIAN_ALIASES_KEYS, OBSIDIAN_ALIAS_KEY_PLURAL, QuoteCharacter, removeYamlSection, setYamlSection, SpecialArrayFormats, splitValueIfSingleOrMultilineArray, isValueEscapedAlready} from '../utils/yaml';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {getFirstHeaderOneText, yamlRegex} from '../utils/regex';
import {isNumeric} from '../utils/strings';

class YamlTitleAliasOptions implements Options {
  preserveExistingAliasesSectionStyle?: boolean = true;
  keepAliasThatMatchesTheFilename?: boolean = false;
  useYamlKeyToKeepTrackOfOldFilenameOrHeading?: boolean = true;
  aliasHelperKey?: string = DEFAULT_LINTER_ALIASES_HELPER_KEY;

  @RuleBuilder.noSettingControl()
    aliasArrayStyle?: NormalArrayFormats | SpecialArrayFormats = NormalArrayFormats.MultiLine;

  @RuleBuilder.noSettingControl()
    fileName?: string;

  @RuleBuilder.noSettingControl()
    defaultEscapeCharacter?: QuoteCharacter = '"';

  @RuleBuilder.noSettingControl()
    removeUnnecessaryEscapeCharsForMultiLineArrays?: boolean = false;
}

@RuleBuilder.register
export default class YamlTitleAlias extends RuleBuilder<YamlTitleAliasOptions> {
  constructor() {
    super({
      nameKey: 'rules.yaml-title-alias.name',
      descriptionKey: 'rules.yaml-title-alias.description',
      type: RuleType.YAML,
      hasSpecialExecutionOrder: true, // this rule must run after capitalize-headings in order to update the alias correctly
    });
  }
  get OptionsClass(): new () => YamlTitleAliasOptions {
    return YamlTitleAliasOptions;
  }
  apply(text: string, options: YamlTitleAliasOptions): string {
    text = initYAML(text);
    const [unescapedTitle, title] = this.getTitleInfo(text, options.fileName, options.aliasArrayStyle, options.defaultEscapeCharacter);

    let previousTitle: string = null;
    const yaml = text.match(yamlRegex)[1];

    const shouldRemoveTitleAlias = !options.keepAliasThatMatchesTheFilename && unescapedTitle === options.fileName;

    let newYaml = yaml.replace('---\n', '').replace('\n---', '');
    const parsedYaml = loadYAML(yaml);
    let aliasHelperKey = options.aliasHelperKey ?? DEFAULT_LINTER_ALIASES_HELPER_KEY;
    if (aliasHelperKey.endsWith(':')) {
      aliasHelperKey = aliasHelperKey.substring(0, aliasHelperKey.length - 1);
    }

    previousTitle = parsedYaml[aliasHelperKey] ?? null;
    if (previousTitle != null) {
      // force previousTitle to be a string by concatenating with an empty string to make non-strings like numbers get handled correctly
      previousTitle = previousTitle + '';
      // escaping the previous title makes sure that we will be able to find it in the array if needed to be escaped there, but not in the title placeholder
      // see https://github.com/platers/obsidian-linter/issues/758 and https://github.com/platers/obsidian-linter/issues/747
      previousTitle = escapeStringIfNecessaryAndPossible(previousTitle, options.defaultEscapeCharacter, this.forceEscape(previousTitle, options.aliasArrayStyle));
    }

    let aliasKeyForFile: string = null;
    const yamlKeys = Object.keys(parsedYaml);
    for (const aliasKey of OBSIDIAN_ALIASES_KEYS) {
      if (yamlKeys.includes(aliasKey)) {
        aliasKeyForFile = aliasKey;

        break;
      }
    }

    if (aliasKeyForFile != null) {
      const aliasesValue = getYamlSectionValue(newYaml, aliasKeyForFile);
      let currentAliasStyle: NormalArrayFormats | SpecialArrayFormats = NormalArrayFormats.MultiLine;
      const isEmpty = aliasesValue === '';
      let isSingleString = false;
      if (!aliasesValue.includes('\n') && !(aliasesValue === '[]' && options.aliasArrayStyle === NormalArrayFormats.MultiLine)) {
        if (aliasesValue.match(/^\[.*\]/) === null) {
          // Note that the value here is just really a placeholder to indicate it is not single-line or multi-line
          currentAliasStyle = SpecialArrayFormats.SingleStringToSingleLine;
          isSingleString = true;
        } else {
          currentAliasStyle = NormalArrayFormats.SingleLine;
        }
      }

      const currentAliasValue = convertAliasValueToStringOrStringArray(splitValueIfSingleOrMultilineArray(aliasesValue));
      const newAliasValue = this.getNewAliasValue(currentAliasValue, shouldRemoveTitleAlias, title, previousTitle);

      if (newAliasValue === '') {
        newYaml = removeYamlSection(newYaml, aliasKeyForFile);
      } else if (options.preserveExistingAliasesSectionStyle) {
        if (!isEmpty && ((isSingleString && title == newAliasValue) || !isSingleString || currentAliasValue == newAliasValue)) {
          newYaml = setYamlSection(newYaml, aliasKeyForFile, formatYamlArrayValue(newAliasValue, currentAliasStyle, options.defaultEscapeCharacter, options.removeUnnecessaryEscapeCharsForMultiLineArrays, true/* escape numeric aliases see https://github.com/platers/obsidian-linter/issues/747*/));
        } else {
          newYaml = setYamlSection(newYaml, aliasKeyForFile, formatYamlArrayValue(newAliasValue, options.aliasArrayStyle, options.defaultEscapeCharacter, options.removeUnnecessaryEscapeCharsForMultiLineArrays, true/* escape numeric aliases see https://github.com/platers/obsidian-linter/issues/747*/));
        }
      } else {
        newYaml = setYamlSection(newYaml, aliasKeyForFile, formatYamlArrayValue(newAliasValue, options.aliasArrayStyle, options.defaultEscapeCharacter, options.removeUnnecessaryEscapeCharsForMultiLineArrays, true/* escape numeric aliases see https://github.com/platers/obsidian-linter/issues/747*/));
      }
    } else if (!shouldRemoveTitleAlias) {
      newYaml = setYamlSection(newYaml, OBSIDIAN_ALIAS_KEY_PLURAL, formatYamlArrayValue(title, options.aliasArrayStyle, options.defaultEscapeCharacter, options.removeUnnecessaryEscapeCharsForMultiLineArrays, true/* escape numeric aliases see https://github.com/platers/obsidian-linter/issues/747*/));
    }

    if (!options.useYamlKeyToKeepTrackOfOldFilenameOrHeading || shouldRemoveTitleAlias) {
      newYaml = removeYamlSection(newYaml, aliasHelperKey);
    } else {
      newYaml = setYamlSection(newYaml, aliasHelperKey, ` ${title}`);
    }

    const oldYaml = `---\n${yaml}---`;
    let newYamlValue = `---\n${newYaml}---`;
    if (newYaml === '') {
      newYamlValue = '';
    }

    text = text.replace(oldYaml, newYamlValue);

    if (newYaml === '') {
      text = text.trimStart();
    }

    return text;
  }
  getTitleInfo(text: string, fileName: string, aliasArrayStyle: NormalArrayFormats | SpecialArrayFormats, defaultEscapeCharacter: QuoteCharacter): [string, string] {
    let unescapedTitle = ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.tag], text, getFirstHeaderOneText);
    unescapedTitle = unescapedTitle || fileName;

    const escapedTitle = escapeStringIfNecessaryAndPossible(unescapedTitle, defaultEscapeCharacter, this.forceEscape(unescapedTitle, aliasArrayStyle));

    return [unescapedTitle, escapedTitle];
  }
  forceEscape(title: string, aliasArrayStyle: NormalArrayFormats | SpecialArrayFormats): boolean {
    return isNumeric(title) || (title.includes(',') && (aliasArrayStyle === NormalArrayFormats.SingleLine || aliasArrayStyle === SpecialArrayFormats.SingleStringToSingleLine || aliasArrayStyle === SpecialArrayFormats.SingleStringCommaDelimited));
  }
  getNewAliasValue(originalValue: string |string[], shouldRemoveTitle: boolean, title: string, previousTitle: string): string |string[] {
    if (originalValue == null) {
      return shouldRemoveTitle ? '' : title;
    }

    if (typeof originalValue === 'string') {
      if (shouldRemoveTitle) {
        if (originalValue === title) {
          originalValue = '';
        }
      } else if (previousTitle === originalValue) {
        originalValue = title;
      } else {
        originalValue = [title, originalValue];
      }
    } else if (previousTitle !== null) {
      let previousTitleIndex = originalValue.indexOf(previousTitle);
      if (previousTitleIndex === -1 && isValueEscapedAlready(previousTitle)) {
        previousTitleIndex = originalValue.indexOf(previousTitle.substring(1, previousTitle.length - 1));
      }

      if (previousTitleIndex !== -1) {
        if (shouldRemoveTitle) {
          originalValue.splice(previousTitleIndex, 1);
        } else {
          originalValue[previousTitleIndex] = title;
        }
      } else {
        originalValue = [title, ...originalValue];
      }
    } else {
      const currentTitleIndex = originalValue.indexOf(title);
      if (currentTitleIndex !== -1) {
        if (shouldRemoveTitle) {
          originalValue.splice(currentTitleIndex, 1);
        }
      } else if (!shouldRemoveTitle) {
        originalValue = [title, ...originalValue];
      }
    }

    if (originalValue === '' || originalValue.length === 0) {
      return '';
    }

    return originalValue;
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
        description: 'Adds a header with the title from heading without YAML key when the use of the YAML key is set to false.',
        before: dedent`
          # Obsidian
        `,
        after: dedent`
          ---
          aliases:
            - Obsidian
          ---
          # Obsidian
        `,
        options: {
          useYamlKeyToKeepTrackOfOldFilenameOrHeading: false,
        },
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
      new ExampleBuilder({
        description: 'Adds a header with the title without YAML key when the use of the YAML key is set to false.',
        before: dedent`
          ${''}
        `,
        after: dedent`
          ---
          aliases:
            - Filename
          ---
          ${''}
        `,
        options: {
          fileName: 'Filename',
          keepAliasThatMatchesTheFilename: true,
          useYamlKeyToKeepTrackOfOldFilenameOrHeading: false,
        },
      }),
      new ExampleBuilder({
        description: 'Replaces old filename with new filename when no header is present and filename is different than the old one listed in `linter-yaml-title-alias`.',
        before: dedent`
          ---
          aliases:
            - Old Filename
            - Alias 2
          linter-yaml-title-alias: Old Filename
          ---
          ${''}
        `,
        after: dedent`
          ---
          aliases:
            - Filename
            - Alias 2
          linter-yaml-title-alias: Filename
          ---
          ${''}
        `,
        options: {
          fileName: 'Filename',
          keepAliasThatMatchesTheFilename: true,
        },
      }),
      new ExampleBuilder({ // accounts for https://github.com/platers/obsidian-linter/issues/470
        description: 'Make sure that markdown and wiki links in first H1 get their values converted to text',
        before: dedent`
          # This is a [Heading](markdown.md)
        `,
        after: dedent`
          ---
          aliases:
            - This is a Heading
          linter-yaml-title-alias: This is a Heading
          ---
          # This is a [Heading](markdown.md)
        `,
        options: {
          aliasArrayStyle: NormalArrayFormats.MultiLine,
        },
      }),
      new ExampleBuilder({ // accounts for https://github.com/platers/obsidian-linter/issues/1044
        description: 'Using `title` as `Alias Helper Key` sets the value of `title` to the alias.',
        before: dedent`
          ${''}
        `,
        after: dedent`
          ---
          aliases:
            - Filename
          title: Filename
          ---
          ${''}
        `,
        options: {
          fileName: 'Filename',
          keepAliasThatMatchesTheFilename: true,
          aliasArrayStyle: NormalArrayFormats.MultiLine,
          aliasHelperKey: 'title',
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<YamlTitleAliasOptions>[] {
    return [
      new BooleanOptionBuilder({
        OptionsClass: YamlTitleAliasOptions,
        nameKey: 'rules.yaml-title-alias.preserve-existing-alias-section-style.name',
        descriptionKey: 'rules.yaml-title-alias.preserve-existing-alias-section-style.description',
        optionsKey: 'preserveExistingAliasesSectionStyle',
      }),
      new BooleanOptionBuilder({
        OptionsClass: YamlTitleAliasOptions,
        nameKey: 'rules.yaml-title-alias.keep-alias-that-matches-the-filename.name',
        descriptionKey: 'rules.yaml-title-alias.keep-alias-that-matches-the-filename.description',
        optionsKey: 'keepAliasThatMatchesTheFilename',
      }),
      new BooleanOptionBuilder({
        OptionsClass: YamlTitleAliasOptions,
        nameKey: 'rules.yaml-title-alias.use-yaml-key-to-keep-track-of-old-filename-or-heading.name',
        descriptionKey: 'rules.yaml-title-alias.use-yaml-key-to-keep-track-of-old-filename-or-heading.description',
        optionsKey: 'useYamlKeyToKeepTrackOfOldFilenameOrHeading',
      }),
      new TextOptionBuilder({
        OptionsClass: YamlTitleAliasOptions,
        nameKey: 'rules.yaml-title-alias.alias-helper-key.name',
        descriptionKey: 'rules.yaml-title-alias.alias-helper-key.description',
        optionsKey: 'aliasHelperKey',
      }),
    ];
  }
}
