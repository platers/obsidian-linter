import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {escapeStringIfNecessaryAndPossible, formatYAML, QuoteCharacter} from '../utils/yaml';

class EscapeYamlSpecialCharactersOptions implements Options {
  @RuleBuilder.noSettingControl()
    defaultEscapeCharacter?: QuoteCharacter = '"';
  tryToEscapeSingleLineArrays?: boolean = false;
}

@RuleBuilder.register
export default class EscapeYamlSpecialCharacters extends RuleBuilder<EscapeYamlSpecialCharactersOptions> {
  constructor() {
    super({
      nameKey: 'rules.escape-yaml-special-characters.name',
      descriptionKey: 'rules.escape-yaml-special-characters.description',
      type: RuleType.YAML,
      hasSpecialExecutionOrder: true,
    });
  }
  get OptionsClass(): new () => EscapeYamlSpecialCharactersOptions {
    return EscapeYamlSpecialCharactersOptions;
  }
  apply(text: string, options: EscapeYamlSpecialCharactersOptions): string {
    return formatYAML(text, (text) => {
      const yamlLines = text.split('\n');

      const yamlLineCount = yamlLines.length;
      if (yamlLineCount < 1) {
        return text;
      }

      for (let i = 0; i < yamlLineCount; i++) {
        const line = yamlLines[i].trim();

        const firstColonIndex = line.indexOf(':');
        const isKeyValueLineWithoutValue = firstColonIndex < 0 || firstColonIndex + 1 >= line.length;
        const startsWithDash = line.startsWith('-');
        const isArrayItemLineWithoutValue = startsWithDash && line.length < 2;
        if (isKeyValueLineWithoutValue && isArrayItemLineWithoutValue) {
          continue;
        }

        let valueStartIndex = 1;
        if (!startsWithDash) {
          valueStartIndex += firstColonIndex;
        } else if (firstColonIndex !== -1 && i + 1 < yamlLineCount) { // account for arrays of dictionaries
          const fullLine = yamlLines[i];
          let expectedIndentationToBeAnArrayOfDictionaries = fullLine.indexOf('-') + 1;
          while (expectedIndentationToBeAnArrayOfDictionaries < fullLine.length && fullLine.charAt(expectedIndentationToBeAnArrayOfDictionaries) === ' ') {
            expectedIndentationToBeAnArrayOfDictionaries++;
          }

          let actualIndentationOfNextLine = 0;
          const nextLine = yamlLines[i+1];
          while (actualIndentationOfNextLine < nextLine.length && nextLine.charAt(actualIndentationOfNextLine) === ' ') {
            actualIndentationOfNextLine++;
          }

          if (expectedIndentationToBeAnArrayOfDictionaries <= actualIndentationOfNextLine) {
            valueStartIndex += firstColonIndex;
          }
        }

        const value = line.substring(valueStartIndex).trim();
        if (value.startsWith('[')) {
          if (options.tryToEscapeSingleLineArrays) {
            if (value.length < 3) {
              continue;
            }

            // Note: this does not account for list items that are already in single or double quotes,
            // but we can address that if we run into such a scenario
            const arrayItems = value.substring(1, value.length - 1).split(',');
            const numberOfArrayItems = arrayItems.length;
            for (let j = 0; j < numberOfArrayItems; j++) {
              let arrayItem = arrayItems[j].trim();
              if (arrayItem.startsWith('[')) {
                arrayItem = arrayItem.substring(1).trimStart();
              }

              if (arrayItem.endsWith(']')) {
                arrayItem = arrayItem.substring(0, arrayItem.length - 1).trimEnd();
              }

              arrayItems[j] = arrayItems[j].replace(arrayItem, escapeStringIfNecessaryAndPossible(arrayItem, options.defaultEscapeCharacter, false, true));
            }

            yamlLines[i] = yamlLines[i].replace(value, '[' + arrayItems.join(',') + ']');
          }

          continue;
        }

        yamlLines[i] = yamlLines[i].replace(value, escapeStringIfNecessaryAndPossible(value, options.defaultEscapeCharacter, false, true));
      }

      return yamlLines.join('\n');
    });
  }
  get exampleBuilders(): ExampleBuilder<EscapeYamlSpecialCharactersOptions>[] {
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
        description: 'YAML with unescaped values',
        before: dedent`
          ---
          key: value: with colon in the middle
          secondKey: value with ' a single quote present
          thirdKey: "already escaped: value"
          fourthKey: value with " a double quote present
          fifthKey: value with both ' " a double and single quote present is not escaped, but is invalid YAML
          sixthKey: colon:between characters is fine
          otherKey: []
          ---
        `,
        after: dedent`
          ---
          key: "value: with colon in the middle"
          secondKey: "value with ' a single quote present"
          thirdKey: "already escaped: value"
          fourthKey: 'value with " a double quote present'
          fifthKey: value with both ' " a double and single quote present is not escaped, but is invalid YAML
          sixthKey: colon:between characters is fine
          otherKey: []
          ---
        `,
      }),
      new ExampleBuilder({
        description: 'YAML with unescaped values in an expanded list with `Default Escape Character = \'`',
        before: dedent`
          ---
          key:
            - value: with colon in the middle
            - value with ' a single quote present
            - 'already escaped: value'
            - value with " a double quote present
            - value with both ' " a double and single quote present is not escaped, but is invalid YAML
            - colon:between characters is fine
          ---
        `,
        after: dedent`
          ---
          key:
            - 'value: with colon in the middle'
            - "value with ' a single quote present"
            - 'already escaped: value'
            - 'value with " a double quote present'
            - value with both ' " a double and single quote present is not escaped, but is invalid YAML
            - colon:between characters is fine
          ---
        `,
        options: {
          defaultEscapeCharacter: '\'',
        },
      }),
      new ExampleBuilder({
        description: 'YAML with unescaped values with arrays',
        before: dedent`
          ---
          array: [value: with colon in the middle, value with ' a single quote present, "already escaped: value", value with " a double quote present, value with both ' " a double and single quote present is not escaped but is invalid YAML, colon:between characters is fine]
          nestedArray: [[value: with colon in the middle, value with ' a single quote present], ["already escaped: value", value with " a double quote present], value with both ' " a double and single quote present is not escaped but is invalid YAML, colon:between characters is fine]
          nestedArray2: [[value: with colon in the middle], value with ' a single quote present]
          ---
          ${''}
          _Note that escaped commas in a YAML array will be treated as a separator._
        `,
        after: dedent`
          ---
          array: ["value: with colon in the middle", "value with ' a single quote present", "already escaped: value", 'value with " a double quote present', value with both ' " a double and single quote present is not escaped but is invalid YAML, colon:between characters is fine]
          nestedArray: [["value: with colon in the middle", "value with ' a single quote present"], ["already escaped: value", 'value with " a double quote present'], value with both ' " a double and single quote present is not escaped but is invalid YAML, colon:between characters is fine]
          nestedArray2: [["value: with colon in the middle"], "value with ' a single quote present"]
          ---
          ${''}
          _Note that escaped commas in a YAML array will be treated as a separator._
        `,
        options: {
          tryToEscapeSingleLineArrays: true,
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<EscapeYamlSpecialCharactersOptions>[] {
    return [
      new BooleanOptionBuilder({
        OptionsClass: EscapeYamlSpecialCharactersOptions,
        nameKey: 'rules.escape-yaml-special-characters.try-to-escape-single-line-arrays.description',
        descriptionKey: 'rules.escape-yaml-special-characters.try-to-escape-single-line-arrays.name',
        optionsKey: 'tryToEscapeSingleLineArrays',
      }),
    ];
  }
}
