import {Options, RuleType} from '../rules';
import RuleBuilder, {DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase, ListItemOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {parse} from 'yaml';
import {IgnoreTypes} from '../utils/ignore-types';
import {ProtectedRanges} from '../utils/protected-ranges';
import {textReplacement} from '../utils/strings';
import {applyNonOverlappingReplacements} from '../utils/text-edits';
import {
  escapeStringIfNecessaryAndPossible,
  formatYAML,
  formatYamlArrayValue,
  getYAMLText,
  getYamlSectionValue,
  initYAML,
  NormalArrayFormats,
  QuoteCharacter,
  setYamlSection,
  splitValueIfSingleOrMultilineArray,
} from '../utils/yaml';
import {isValidYamlKeyOnly} from '../utils/validation';

type FullLineFieldOperations = 'Leave in place' | 'Move and keep in text' | 'Move and remove';
type BracketedFieldOperations = 'Leave in place' | 'Move and keep in text' | 'Move and keep value in text' | 'Move and remove';
type ExistingKeyOperations = 'Skip' | 'Merge into list' | 'Overwrite';

class MoveInlineFieldsToYamlOptions implements Options {
  howToHandleFullLineFields?: FullLineFieldOperations = 'Move and remove';
  howToHandleBracketedFields?: BracketedFieldOperations = 'Leave in place';
  howToHandleExistingKeys?: ExistingKeyOperations = 'Skip';
  inlineKeysToIgnore?: string[] = [];
  @RuleBuilder.noSettingControl()
    defaultEscapeCharacter?: QuoteCharacter = '"';
}

type InlineField = {
  key: string,
  value: string,
  // the start and end of the field in the file, which is the whole line for a full-line field
  startIndex: number,
  endIndex: number,
  lineStartIndex: number,
  lineEndIndex: number,
  isBracketed: boolean,
};

type LineRelativeField = {key: string, value: string, start: number, end: number};

// The parsing below follows Dataview's `src/data-import/inline-field.ts` so that the fields moved are the
// same ones Dataview would read from the file.
const inlineFieldWrappers: Record<string, string> = {'[': ']', '(': ')'};
// FULL_LINE_KEY_PART along with the markup that Dataview strips from before and after it
const fullLineKeyRegex = /^[^0-9\w\p{Letter}]*((?:\p{Extended_Pictographic}|\u{200D}|\u{FE0F}|[0-9\p{Letter}\w\s/-])*)[_*~`]*$/u;
const plainYamlKeyRegex = /^[\p{Letter}_][\p{Letter}\p{Number}_/-]*$/u;

@RuleBuilder.register
export default class MoveInlineFieldsToYaml extends RuleBuilder<MoveInlineFieldsToYamlOptions> {
  constructor() {
    super({
      nameKey: 'rules.move-inline-fields-to-yaml.name',
      descriptionKey: 'rules.move-inline-fields-to-yaml.description',
      type: RuleType.YAML,
      // runs at the end of the rules that run before the regular rules so that the keys it adds are formatted by the other YAML rules
      hasSpecialExecutionOrder: true,
      // Dataview scopes fields on list items and tasks to the list item, so those are always left alone.
      // Tables and comments are left alone as removing a line from them would change their contents.
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.inlineCode, IgnoreTypes.math, IgnoreTypes.inlineMath, IgnoreTypes.html, IgnoreTypes.list, IgnoreTypes.table, IgnoreTypes.obsidianMultiLineComments],
    });
  }
  get OptionsClass(): new () => MoveInlineFieldsToYamlOptions {
    return MoveInlineFieldsToYamlOptions;
  }
  apply(text: string, options: MoveInlineFieldsToYamlOptions, protectedRanges: ProtectedRanges): string {
    // the frontmatter is updated below, so it is only left alone when looking for fields
    const bodyProtectedRanges = protectedRanges.combinedWith([IgnoreTypes.yaml]);
    const fields = this.getInlineFields(text, bodyProtectedRanges, options);
    if (fields.length === 0) {
      return text;
    }

    const fieldsByKey = new Map<string, InlineField[]>();
    for (const field of fields) {
      if (!fieldsByKey.has(field.key)) {
        fieldsByKey.set(field.key, []);
      }

      fieldsByKey.get(field.key).push(field);
    }

    // work out what goes into the frontmatter before changing anything so that a key which cannot be moved
    // leaves all of its fields in the body
    const existingYaml = getYAMLText(text) ?? '';
    const yamlUpdates: {key: string, value: string}[] = [];
    const movedFields: InlineField[] = [];
    for (const [key, keyFields] of fieldsByKey) {
      const newValues = keyFields.map((field) => field.value).filter((value) => value !== '').map((value) => this.escapeValue(value, options.defaultEscapeCharacter));
      const existingValue = getYamlSectionValue(existingYaml, key, false);

      let yamlValue: string;
      if (existingValue == null || options.howToHandleExistingKeys === 'Overwrite') {
        yamlValue = this.formatValues(newValues, NormalArrayFormats.SingleLine, options.defaultEscapeCharacter);
      } else if (options.howToHandleExistingKeys === 'Merge into list') {
        const existingValues = this.getMergeableValues(existingValue);
        if (existingValues == null) {
          continue;
        }

        for (const value of newValues) {
          if (!existingValues.includes(value)) {
            existingValues.push(value);
          }
        }

        const format = existingValue.startsWith('\n') ? NormalArrayFormats.MultiLine : NormalArrayFormats.SingleLine;
        yamlValue = this.formatValues(existingValues, format, options.defaultEscapeCharacter);
      } else {
        continue;
      }

      yamlUpdates.push({key: this.formatKey(key, options.defaultEscapeCharacter), value: yamlValue});
      movedFields.push(...keyFields);
    }

    if (movedFields.length === 0) {
      return text;
    }

    // the frontmatter is updated first so that removing lines from the body cannot turn the start of the body into frontmatter
    let newText = initYAML(text);
    newText = formatYAML(newText, (yaml: string) => {
      yaml = yaml.replace('---\n', '').replace('---', '');
      for (const update of yamlUpdates) {
        yaml = setYamlSection(yaml, update.key, update.value, false);
      }

      return `---\n${yaml}---`;
    });

    const yamlLengthChange = newText.length - text.length;
    const fieldsToChange = movedFields.filter((field) => (field.isBracketed ? options.howToHandleBracketedFields : options.howToHandleFullLineFields) !== 'Move and keep in text');
    const bodyEdits = this.getBodyEdits(text, fieldsToChange, options).map((edit) => {
      let startIndex = edit.startIndex + yamlLengthChange;
      // A newly inserted frontmatter supplies the line ending before a removal of the whole file.
      if (edit.startIndex === 0 && edit.endIndex === text.length && !text.endsWith('\n') && newText.charAt(startIndex - 1) === '\n') {
        startIndex--;
      }

      return {startIndex, endIndex: edit.endIndex + yamlLengthChange, value: edit.value};
    });

    return applyNonOverlappingReplacements(newText, bodyEdits);
  }
  getInlineFields(text: string, protectedRanges: ProtectedRanges, options: MoveInlineFieldsToYamlOptions): InlineField[] {
    const fields: InlineField[] = [];
    let lineStartIndex = 0;
    while (lineStartIndex <= text.length) {
      let lineEndIndex = text.indexOf('\n', lineStartIndex);
      if (lineEndIndex === -1) {
        lineEndIndex = text.length;
      }

      const line = text.substring(lineStartIndex, lineEndIndex);
      if (line.includes('::')) {
        // like Dataview, a line with a bracketed field is never treated as a full-line field
        const bracketedFields = extractBracketedFields(line);
        if (bracketedFields.length > 0) {
          if (options.howToHandleBracketedFields !== 'Leave in place') {
            for (const field of bracketedFields) {
              const startIndex = lineStartIndex + field.start;
              const endIndex = lineStartIndex + field.end;
              if (field.key === '' || options.inlineKeysToIgnore.includes(field.key) || protectedRanges.isProtected(startIndex, endIndex)) {
                continue;
              }

              fields.push({key: field.key, value: field.value, startIndex, endIndex, lineStartIndex, lineEndIndex, isBracketed: true});
            }
          }
        } else {
          const field = options.howToHandleFullLineFields === 'Leave in place' ? undefined : extractFullLineField(line);
          if (field != null && field.key !== '' && !options.inlineKeysToIgnore.includes(field.key) && !protectedRanges.isProtected(lineStartIndex, lineEndIndex)) {
            fields.push({key: field.key, value: field.value, startIndex: lineStartIndex, endIndex: lineEndIndex, lineStartIndex, lineEndIndex, isBracketed: false});
          }
        }
      }

      lineStartIndex = lineEndIndex + 1;
    }

    return fields;
  }
  getBodyEdits(text: string, movedFields: InlineField[], options: MoveInlineFieldsToYamlOptions): textReplacement[] {
    const edits: textReplacement[] = [];
    const linesToRemove: {startIndex: number, endIndex: number}[] = [];
    const fieldsByLine = new Map<number, InlineField[]>();
    for (const field of movedFields) {
      if (!fieldsByLine.has(field.lineStartIndex)) {
        fieldsByLine.set(field.lineStartIndex, []);
      }

      fieldsByLine.get(field.lineStartIndex).push(field);
    }

    for (const [lineStartIndex, lineFields] of fieldsByLine) {
      const lineEndIndex = lineFields[0].lineEndIndex;
      if (!lineFields[0].isBracketed) {
        linesToRemove.push({startIndex: lineStartIndex, endIndex: lineEndIndex});
        continue;
      }

      const lineEdits: textReplacement[] = [];
      let lastEditEnd = lineStartIndex;
      for (const field of lineFields.sort((a, b) => a.startIndex - b.startIndex)) {
        if (options.howToHandleBracketedFields === 'Move and keep value in text' && field.value !== '') {
          lineEdits.push({startIndex: field.startIndex, endIndex: field.endIndex, value: field.value});
          lastEditEnd = field.endIndex;
          continue;
        }

        // remove the whitespace on one side of the field so that no double space or trailing whitespace is left behind
        let startIndex = field.startIndex;
        let endIndex = field.endIndex;
        let whitespaceBefore = 0;
        while (startIndex - whitespaceBefore > lastEditEnd && isSpaceOrTab(text.charAt(startIndex - whitespaceBefore - 1))) {
          whitespaceBefore++;
        }

        if (whitespaceBefore > 0 || startIndex === lineStartIndex) {
          while (endIndex < lineEndIndex && isSpaceOrTab(text.charAt(endIndex))) {
            endIndex++;
          }
        }

        if (endIndex === lineEndIndex) {
          startIndex -= whitespaceBefore;
        }

        lineEdits.push({startIndex, endIndex, value: ''});
        lastEditEnd = endIndex;
      }

      const updatedLine = applyNonOverlappingReplacements(text.substring(lineStartIndex, lineEndIndex), lineEdits.map((edit) => {
        return {startIndex: edit.startIndex - lineStartIndex, endIndex: edit.endIndex - lineStartIndex, value: edit.value};
      }));
      if (updatedLine.trim() === '') {
        linesToRemove.push({startIndex: lineStartIndex, endIndex: lineEndIndex});
      } else {
        edits.push(...lineEdits);
      }
    }

    // remove each line along with its line ending, joining consecutive lines into a single removal
    linesToRemove.sort((a, b) => a.startIndex - b.startIndex);
    const removals: textReplacement[] = [];
    for (const line of linesToRemove) {
      const endIndex = Math.min(line.endIndex + 1, text.length);
      const previous = removals[removals.length - 1];
      if (previous && previous.endIndex === line.startIndex) {
        previous.endIndex = endIndex;
      } else {
        removals.push({startIndex: line.startIndex, endIndex, value: ''});
      }
    }

    // when the last line of the file is removed, remove the line ending before it instead
    const lastRemoval = removals[removals.length - 1];
    if (lastRemoval && lastRemoval.endIndex === text.length && lastRemoval.startIndex > 0 && !text.endsWith('\n')) {
      lastRemoval.startIndex--;
    }

    return [...edits, ...removals];
  }
  escapeValue(value: string, defaultEscapeCharacter: QuoteCharacter): string {
    // numbers, booleans, and plain strings keep their type when left unescaped
    try {
      const parsedValue = parse(value, {logLevel: 'error'}) as unknown;
      if ((typeof parsedValue === 'string' && parsedValue === value) || typeof parsedValue === 'number' || typeof parsedValue === 'boolean') {
        return value;
      }
    } catch {
      // invalid YAML needs to be escaped
    }

    return escapeStringIfNecessaryAndPossible(value, defaultEscapeCharacter, true);
  }
  formatKey(key: string, defaultEscapeCharacter: QuoteCharacter): string {
    if (plainYamlKeyRegex.test(key) && parse(key) === key) {
      return key;
    }

    return escapeStringIfNecessaryAndPossible(key, defaultEscapeCharacter, true);
  }
  formatValues(values: string[], format: NormalArrayFormats, defaultEscapeCharacter: QuoteCharacter): string {
    if (values.length === 0) {
      return '';
    } else if (values.length === 1) {
      return ' ' + values[0];
    }

    return formatYamlArrayValue(values, format, defaultEscapeCharacter, false);
  }
  /**
   * Gets the values of an existing YAML key that inline values can be added to.
   * @param {string} value The existing value of the key in the frontmatter
   * @return {string[] | null} The existing values or null when the value is not a scalar or an array of scalars
   */
  getMergeableValues(value: string): string[] | null {
    const trimmedValue = value.trim();
    if (trimmedValue === '') {
      return [];
    } else if (/^[|>]/.test(trimmedValue) || /\s#/.test(trimmedValue)) {
      // block scalars and comments would not survive being split up
      return null;
    }

    let parsedValue: unknown;
    try {
      parsedValue = parse(value, {logLevel: 'error'});
    } catch {
      return null;
    }

    if (parsedValue != null && typeof parsedValue === 'object') {
      if (!Array.isArray(parsedValue) || parsedValue.some((item) => item != null && typeof item === 'object')) {
        return null;
      }
    }

    const values = splitValueIfSingleOrMultilineArray(value);
    if (values == null) {
      return [];
    }

    return typeof values === 'string' ? [values] : values;
  }
  get exampleBuilders(): ExampleBuilder<MoveInlineFieldsToYamlOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Moves full-line fields to the YAML frontmatter and removes their lines while leaving list items, bracketed fields, and code alone',
        before: dedent`
          # Book notes
          Author:: Terry Pratchett
          Series:: [[Discworld]]
          Rating:: 5
          ${''}
          - Fields on list items like this:: one are left alone
          - [ ] So are fields on tasks [due:: 2024-01-01]
          ${''}
          I read it in a day [mood:: happy].
          \`\`\`
          code:: is ignored
          \`\`\`
        `,
        after: dedent`
          ---
          Author: Terry Pratchett
          Series: "[[Discworld]]"
          Rating: 5
          ---
          # Book notes
          ${''}
          - Fields on list items like this:: one are left alone
          - [ ] So are fields on tasks [due:: 2024-01-01]
          ${''}
          I read it in a day [mood:: happy].
          \`\`\`
          code:: is ignored
          \`\`\`
        `,
      }),
      new ExampleBuilder({
        description: 'Keys that are not plain YAML keys are escaped and Markdown around a full-line key is removed',
        before: dedent`
          **Date Read**:: 2024-01-01
          Project Status:: in progress
        `,
        after: dedent`
          ---
          "Date Read": 2024-01-01
          "Project Status": in progress
          ---
        `,
      }),
      new ExampleBuilder({
        description: 'Adds full-line fields to the YAML frontmatter and leaves their lines, including any Markdown or emoji around the key, as they are when `Full-line inline fields = \'Move and keep in text\'`',
        before: dedent`
          # 🎉 Party:: yes
          > **Status**:: done
        `,
        after: dedent`
          ---
          Party: yes
          Status: done
          ---
          # 🎉 Party:: yes
          > **Status**:: done
        `,
        options: {
          howToHandleFullLineFields: 'Move and keep in text',
        },
      }),
      new ExampleBuilder({
        description: 'Moves bracketed fields and keeps their values in the text when `Bracketed inline fields = \'Move and keep value in text\'`',
        before: dedent`
          I want to eat [taste:: pie] after (meal:: dinner).
        `,
        after: dedent`
          ---
          taste: pie
          meal: dinner
          ---
          I want to eat pie after dinner.
        `,
        options: {
          howToHandleBracketedFields: 'Move and keep value in text',
        },
      }),
      new ExampleBuilder({
        description: 'Moves bracketed fields and removes them when `Bracketed inline fields = \'Move and remove\'`, removing lines that are left with only whitespace',
        before: dedent`
          # Recipe
          [servings:: 4] [time:: 30 minutes]
          Serve warm [course:: dessert] with ice cream.
        `,
        after: dedent`
          ---
          servings: 4
          time: 30 minutes
          course: dessert
          ---
          # Recipe
          Serve warm with ice cream.
        `,
        options: {
          howToHandleBracketedFields: 'Move and remove',
        },
      }),
      new ExampleBuilder({
        description: 'Leaves fields whose key is already in the YAML frontmatter alone when `When the key already exists = \'Skip\'`',
        before: dedent`
          ---
          context: work
          ---
          context:: home
          Context:: garden
        `,
        after: dedent`
          ---
          context: work
          Context: garden
          ---
          context:: home
        `,
      }),
      new ExampleBuilder({
        description: 'Adds values to the existing key when `When the key already exists = \'Merge into list\'`',
        before: dedent`
          ---
          context: work
          ---
          context:: home
          context:: garden
        `,
        after: dedent`
          ---
          context: [work, home, garden]
          ---
        `,
        options: {
          howToHandleExistingKeys: 'Merge into list',
        },
      }),
      new ExampleBuilder({
        description: 'Replaces the value of the existing key when `When the key already exists = \'Overwrite\'`',
        before: dedent`
          ---
          status: draft
          ---
          status:: published
        `,
        after: dedent`
          ---
          status: published
          ---
        `,
        options: {
          howToHandleExistingKeys: 'Overwrite',
        },
      }),
      new ExampleBuilder({
        description: 'Leaves fields alone when their key is in `Inline keys to ignore = \'related\'`',
        before: dedent`
          related:: [[Another note]]
          topic:: linting
        `,
        after: dedent`
          ---
          topic: linting
          ---
          related:: [[Another note]]
        `,
        options: {
          inlineKeysToIgnore: ['related'],
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<MoveInlineFieldsToYamlOptions>[] {
    return [
      new DropdownOptionBuilder<MoveInlineFieldsToYamlOptions, FullLineFieldOperations>({
        OptionsClass: MoveInlineFieldsToYamlOptions,
        nameKey: 'rules.move-inline-fields-to-yaml.how-to-handle-full-line-fields.name',
        descriptionKey: 'rules.move-inline-fields-to-yaml.how-to-handle-full-line-fields.description',
        optionsKey: 'howToHandleFullLineFields',
        records: [
          {
            value: 'Leave in place',
            description: 'Does not move full-line fields like `key:: value`',
          },
          {
            value: 'Move and keep in text',
            description: 'Adds full-line fields to the YAML frontmatter and leaves their lines as they are',
          },
          {
            value: 'Move and remove',
            description: 'Moves full-line fields to the YAML frontmatter and removes their lines',
          },
        ],
      }),
      new DropdownOptionBuilder<MoveInlineFieldsToYamlOptions, BracketedFieldOperations>({
        OptionsClass: MoveInlineFieldsToYamlOptions,
        nameKey: 'rules.move-inline-fields-to-yaml.how-to-handle-bracketed-fields.name',
        descriptionKey: 'rules.move-inline-fields-to-yaml.how-to-handle-bracketed-fields.description',
        optionsKey: 'howToHandleBracketedFields',
        records: [
          {
            value: 'Leave in place',
            description: 'Does not move bracketed fields like `[key:: value]` and `(key:: value)`',
          },
          {
            value: 'Move and keep in text',
            description: 'Adds bracketed fields to the YAML frontmatter and leaves them in the text as they are',
          },
          {
            value: 'Move and keep value in text',
            description: 'Moves bracketed fields to the YAML frontmatter and replaces them with their value',
          },
          {
            value: 'Move and remove',
            description: 'Moves bracketed fields to the YAML frontmatter and removes them from the body, removing the line if only whitespace is left',
          },
        ],
      }),
      new DropdownOptionBuilder<MoveInlineFieldsToYamlOptions, ExistingKeyOperations>({
        OptionsClass: MoveInlineFieldsToYamlOptions,
        nameKey: 'rules.move-inline-fields-to-yaml.how-to-handle-existing-keys.name',
        descriptionKey: 'rules.move-inline-fields-to-yaml.how-to-handle-existing-keys.description',
        optionsKey: 'howToHandleExistingKeys',
        records: [
          {
            value: 'Skip',
            description: 'Leaves the fields in the body and the YAML frontmatter value as is',
          },
          {
            value: 'Merge into list',
            description: 'Adds the field values to the YAML frontmatter value, turning it into a list',
          },
          {
            value: 'Overwrite',
            description: 'Replaces the YAML frontmatter value with the field values',
          },
        ],
      }),
      new ListItemOptionBuilder({
        OptionsClass: MoveInlineFieldsToYamlOptions,
        nameKey: 'rules.move-inline-fields-to-yaml.inline-keys-to-ignore.name',
        descriptionKey: 'rules.move-inline-fields-to-yaml.inline-keys-to-ignore.description',
        emptyStateKey: 'rules.move-inline-fields-to-yaml.inline-keys-to-ignore.empty-state',
        fieldNamePlaceholderKey: 'rules.move-inline-fields-to-yaml.inline-keys-to-ignore.placeholder-text',
        optionsKey: 'inlineKeysToIgnore',
        validator: isValidYamlKeyOnly,
      }),
    ];
  }
}

function isSpaceOrTab(char: string): boolean {
  return char === ' ' || char === '\t';
}

/**
 * Finds the closing wrapper at or after `start`, respecting nesting and escapes.
 * @param {string} line The line to search
 * @param {number} start The index to start searching from
 * @param {string} open The opening wrapper character
 * @param {string} close The closing wrapper character
 * @return {{value: string, endIndex: number} | undefined} The trimmed value and the index after the closing wrapper
 */
function findClosing(line: string, start: number, open: string, close: string): {value: string, endIndex: number} | undefined {
  let nesting = 0;
  let escaped = false;
  for (let index = start; index < line.length; index++) {
    const char = line.charAt(index);
    if (char === '\\') {
      escaped = !escaped;
      continue;
    }

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === open) {
      nesting++;
    } else if (char === close) {
      nesting--;
    }

    if (nesting < 0) {
      return {value: line.substring(start, index).trim(), endIndex: index + 1};
    }
  }

  return undefined;
}

function extractBracketedField(line: string, start: number): LineRelativeField | undefined {
  const open = line.charAt(start);
  const separatorIndex = line.indexOf('::', start + 1);
  if (separatorIndex === -1) {
    return undefined;
  }

  const key = line.substring(start + 1, separatorIndex).trim();
  for (const wrapper of [...Object.keys(inlineFieldWrappers), ...Object.values(inlineFieldWrappers)]) {
    if (key.includes(wrapper)) {
      return undefined;
    }
  }

  const value = findClosing(line, separatorIndex + 2, open, inlineFieldWrappers[open]);
  if (value === undefined) {
    return undefined;
  }

  return {key, value: value.value, start, end: value.endIndex};
}

function extractBracketedFields(line: string): LineRelativeField[] {
  const fields: LineRelativeField[] = [];
  for (const wrapper of Object.keys(inlineFieldWrappers)) {
    let foundIndex = line.indexOf(wrapper);
    while (foundIndex >= 0) {
      const field = extractBracketedField(line, foundIndex);
      if (!field) {
        foundIndex = line.indexOf(wrapper, foundIndex + 1);
        continue;
      }

      fields.push(field);
      foundIndex = line.indexOf(wrapper, field.end);
    }
  }

  // a field found with one wrapper can overlap one found with the other, in which case the first one wins
  fields.sort((a, b) => a.start - b.start);
  const filteredFields: LineRelativeField[] = [];
  for (const field of fields) {
    if (filteredFields.length === 0 || filteredFields[filteredFields.length - 1].end < field.start) {
      filteredFields.push(field);
    }
  }

  return filteredFields;
}

function extractFullLineField(line: string): {key: string, value: string} | undefined {
  const separatorIndex = line.indexOf('::');
  if (separatorIndex === -1) {
    return undefined;
  }

  const keyMatch = line.substring(0, separatorIndex).trim().match(fullLineKeyRegex);
  if (keyMatch == null) {
    return undefined;
  }

  return {key: keyMatch[1].trim(), value: line.substring(separatorIndex + 2).trim()};
}
