import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, NumberOptionBuilder, OptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';

class ConvertSpacesToTabsOptions implements Options {
  tabsize: Number = 4;
}

export default class ConvertSpacesToTabs extends RuleBuilder<ConvertSpacesToTabsOptions> {
  get OptionsClass(): new () => ConvertSpacesToTabsOptions {
    return ConvertSpacesToTabsOptions;
  }
  get name(): string {
    return 'Convert Spaces to Tabs';
  }
  get description(): string {
    return 'Converts leading spaces to tabs.';
  }
  get type(): RuleType {
    return RuleType.SPACING;
  }
  apply(text: string, options: ConvertSpacesToTabsOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
      const tabsize = String(options.tabsize);
      const tabsize_regex = new RegExp(
          '^(\t*) {' + String(tabsize) + '}',
          'gm',
      );

      while (text.match(tabsize_regex) != null) {
        text = text.replace(tabsize_regex, '$1\t');
      }
      return text;
    });
  }
  get exampleBuilders(): ExampleBuilder<ConvertSpacesToTabsOptions>[] {
    return [
      /* eslint-disable no-mixed-spaces-and-tabs, no-tabs */
      new ExampleBuilder({
        description: 'Converting spaces to tabs with `tabsize = 3`',
        before: dedent`
          - text with no indention
             - text indented with 3 spaces
          - text with no indention
                - text indented with 6 spaces
        `,
        after: dedent`
          - text with no indention
          \t- text indented with 3 spaces
          - text with no indention
          \t\t- text indented with 6 spaces
        `,
        options: {
          tabsize: 3,
        },
      }),
      /* eslint-enable no-mixed-spaces-and-tabs, no-tabs */
    ];
  }
  get optionBuilders(): OptionBuilder<ConvertSpacesToTabsOptions, any>[] {
    return [
      new NumberOptionBuilder({
        OptionsClass: ConvertSpacesToTabsOptions,
        name: 'Tabsize',
        description: 'Number of spaces that will be converted to a tab',
        optionsKey: 'tabsize',
      }),
    ];
  }
}
