import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase, TextAreaOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {formatYAML, getYamlSectionValue, isValueEscapedAlready, setYamlSection} from '../utils/yaml';

class ForceYamlEscapeOptions implements Options {
  @RuleBuilder.noSettingControl()
    defaultEscapeCharacter?: string = '"';
  forceYamlEscape?: string[] = [];
}

@RuleBuilder.register
export default class ForceYamlEscape extends RuleBuilder<ForceYamlEscapeOptions> {
  get OptionsClass(): new () => ForceYamlEscapeOptions {
    return ForceYamlEscapeOptions;
  }
  get name(): string {
    return 'Force YAML Escape';
  }
  get description(): string {
    return 'Escapes the values for the specified YAML keys.';
  }
  get type(): RuleType {
    return RuleType.YAML;
  }
  apply(text: string, options: ForceYamlEscapeOptions): string {
    return formatYAML(text, (text) => {
      for (const yamlKeyToEscape of options.forceYamlEscape) {
        const keyValue = getYamlSectionValue(text, yamlKeyToEscape);

        if (keyValue != null) {
          // skip yaml array values or already escaped values
          if (keyValue.includes('\n') || keyValue.startsWith(' [') || isValueEscapedAlready(keyValue)) {
            continue;
          }

          text = setYamlSection(text, yamlKeyToEscape, ` ${options.defaultEscapeCharacter}${keyValue}${options.defaultEscapeCharacter}`);
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
        name: 'Force YAML Escape on Keys',
        description: 'Uses the Yaml escape character on the specified Yaml keys separated by a new line character if it is not already escaped. Do not use on Yaml arrays.',
        optionsKey: 'forceYamlEscape',
      }),
    ];
  }
  get hasSpecialExecutionOrder(): boolean {
    return true;
  }
}
