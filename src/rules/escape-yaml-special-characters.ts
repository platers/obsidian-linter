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
  apply(text: string, options: EscapeYamlSpecialCharactersOptions,): string {
    return formatYAML(text, (text) => {
      const yamlLines = text.split('\n');

      if (yamlLines.length < 1) {
        return text;
      }

      /*
      * This is the indentation of the key containing the block scalar.
      *
      * For example, after:
      *
      * description: |
      *   This must not be escaped: "or changed"
      *
      * blockScalarIndentation is 0. Any non-empty line with indentation
      * greater than 0 belongs to the scalar and is skipped.
      */
      let blockScalarIndentation: number | null = null;

      for (let i = 0; i < yamlLines.length; i++) {
        const originalLine = yamlLines[i];
        const indentation = getIndentation(originalLine);
        const trimmedLine = originalLine.trim();

        /*
        * Continue through the contents of a block scalar. Blank lines are
        * also part of the scalar, regardless of indentation.
        */
        if (blockScalarIndentation !== null) {
          if (trimmedLine.length === 0 || indentation > blockScalarIndentation) {
            continue;
          }

          /*
          * A non-empty line at the scalar's parent indentation ends the
          * scalar. Process this line normally.
          */
          blockScalarIndentation = null;
        }

        if (trimmedLine.length === 0) {
          continue;
        }

        const firstColonIndex = trimmedLine.indexOf(':');
        const startsWithDash = trimmedLine.startsWith('-');

        const isKeyValueLineWithoutValue = firstColonIndex < 0 || firstColonIndex + 1 >= trimmedLine.length;

        const isArrayItemLineWithoutValue = startsWithDash && trimmedLine.length < 2;

        if (isKeyValueLineWithoutValue && isArrayItemLineWithoutValue) {
          continue;
        }

        /*
        * Work out the position of the value in the trimmed line using the
        * same rules as the current implementation.
        */
        let valueStartIndex = 1;

        if (!startsWithDash) {
          valueStartIndex += firstColonIndex;
        } else if (firstColonIndex !== -1 && i + 1 < yamlLines.length) {
          /*
          * Account for array items containing mappings:
          *
          *   - key: value
          *     another: value
          */
          const expectedIndentation = originalLine.indexOf('-') + 1;

          let nextLineIndentation = 0;
          const nextLine = yamlLines[i + 1];

          while (nextLineIndentation < nextLine.length && (nextLine[nextLineIndentation] === ' ' || nextLine[nextLineIndentation] === '\t')
          ) {
            nextLineIndentation++;
          }

          if (expectedIndentation <= nextLineIndentation) {
            valueStartIndex += firstColonIndex;
          }
        }

        const value = trimmedLine
          .substring(valueStartIndex)
          .trim();

        /*
        * A block scalar's marker must not be escaped, and every following
        * scalar-content line must be skipped.
        */
        if (isBlockScalarIndicator(value)) {
          blockScalarIndentation = indentation;
          continue;
        }

        if (value.startsWith('[')) {
          if (!options.tryToEscapeSingleLineArrays) {
            continue;
          }

          if (value.length < 3) {
            continue;
          }

          /*
          * Preserve the existing behavior for single-line arrays. This
          * intentionally remains lightweight because the rule's tests include
          * YAML values that are not valid until they are escaped.
          */
          const arrayItems = value
            .substring(1, value.length - 1)
            .split(',');

          for (let j = 0; j < arrayItems.length; j++) {
            let arrayItem = arrayItems[j].trim();

            if (arrayItem.startsWith('[')) {
              arrayItem = arrayItem.substring(1).trimStart();
            }

            if (arrayItem.endsWith(']')) {
              arrayItem = arrayItem
                .substring(0, arrayItem.length - 1)
                .trimEnd();
            }

            arrayItems[j] = arrayItems[j].replace(arrayItem, escapeStringIfNecessaryAndPossible(arrayItem, options.defaultEscapeCharacter, false, true));
          }

          yamlLines[i] = originalLine.replace(value, `[${arrayItems.join(',')}]`);

          continue;
        }

        yamlLines[i] = originalLine.replace(value, escapeStringIfNecessaryAndPossible(value, options.defaultEscapeCharacter, false, true));
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
        description: 'YAML with unescaped values in an expanded list with `Default escape character = \'`',
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
        nameKey: 'rules.escape-yaml-special-characters.try-to-escape-single-line-arrays.name',
        descriptionKey: 'rules.escape-yaml-special-characters.try-to-escape-single-line-arrays.description',
        optionsKey: 'tryToEscapeSingleLineArrays',
      }),
    ];
  }
}

function getIndentation(line: string): number {
  let indentation = 0;
  while (indentation < line.length &&(line[indentation] === ' ' || line[indentation] === '\t')) {
    indentation++;
  }

  return indentation;
}

function isBlockScalarIndicator(value: string): boolean {
  return /^[|>](?:[1-9])?(?:[+-])?(?:[ \t]+#.*)?$/.test(value);
}
