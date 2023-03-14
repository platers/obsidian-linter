import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase, TextAreaOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {escapeStringIfNecessaryAndPossible, formatYAML, getYamlSectionValue, isValueEscapedAlready, QuoteCharacter, setYamlSection} from '../utils/yaml';

class ForceYamlEscapeOptions implements Options {
  @RuleBuilder.noSettingControl()
    defaultEscapeCharacter?: QuoteCharacter = '"';
  forceYamlEscape?: string[] = [];
}

@RuleBuilder.register
export default class ForceYamlEscape extends RuleBuilder<ForceYamlEscapeOptions> {
  constructor() {
    super({
      nameKey: 'rules.force-yaml-escape.name',
      descriptionKey: 'rules.force-yaml-escape.description',
      type: RuleType.YAML,
      hasSpecialExecutionOrder: true,
    });
  }
  get OptionsClass(): new () => ForceYamlEscapeOptions {
    return ForceYamlEscapeOptions;
  }
  apply(text: string, options: ForceYamlEscapeOptions): string {
    return formatYAML(text, (text) => {
      for (const yamlKeyToEscape of options.forceYamlEscape) {
        let keyValue = getYamlSectionValue(text, yamlKeyToEscape);

        if (keyValue != null) {
          // skip yaml array values or already escaped values
          if (keyValue.includes('\n') || keyValue.startsWith(' [') || isValueEscapedAlready(keyValue)) {
            continue;
          }

          keyValue = escapeStringIfNecessaryAndPossible(keyValue, options.defaultEscapeCharacter, true);
          text = setYamlSection(text, yamlKeyToEscape, ' ' + keyValue);
        }
      }

      return text;
    });
  }
  get exampleBuilders(): ExampleBuilder<ForceYamlEscapeOptions>[] {
    return [
      new ExampleBuilder({
        description: 'YAML without anything to escape',
        before: dedent`
          ---
          key: value
          otherKey: []
          ---
        `,
        after: dedent`
          ---
          key: value
          otherKey: []
          ---
        `,
      }),
      new ExampleBuilder({
        description: 'Force YAML keys to be escaped with double quotes where not already escaped with `Force Yaml Escape on Keys = \'key\'\\n\'title\'\\n\'bool\'`',
        before: dedent`
          ---
          key: 'Already escaped value'
          title: This is a title
          bool: false
          unaffected: value
          ---
          ${''}
          _Note that the force Yaml key option should not be used with arrays._
        `,
        after: dedent`
          ---
          key: 'Already escaped value'
          title: "This is a title"
          bool: "false"
          unaffected: value
          ---
          ${''}
          _Note that the force Yaml key option should not be used with arrays._
        `,
        options: {
          forceYamlEscape: ['key', 'title', 'bool'],
          defaultEscapeCharacter: '"',
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<ForceYamlEscapeOptions>[] {
    return [
      new TextAreaOptionBuilder({
        OptionsClass: ForceYamlEscapeOptions,
        nameKey: 'rules.force-yaml-escape.force-yaml-escape-keys.name',
        descriptionKey: 'rules.force-yaml-escape.force-yaml-escape-keys.description',
        optionsKey: 'forceYamlEscape',
      }),
    ];
  }
}
