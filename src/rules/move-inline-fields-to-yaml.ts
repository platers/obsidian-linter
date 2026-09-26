import {Options, RuleType} from '../rules';
import RuleBuilder, {DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase, ListItemOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {parse} from 'yaml';
import {IgnoreTypes} from '../utils/ignore-types';
import {ProtectedRanges} from '../utils/protected-ranges';
import {textReplacement} from '../utils/strings';
import {applyNonOverlappingReplacements} from '../utils/text-edits';
import {
  convertAliasValueToStringOrStringArray,
  convertTagValueToStringOrStringArray,
  escapeStringIfNecessaryAndPossible,
  formatYAML,
  formatYamlArrayValue,
  getYAMLText,
  getYamlSectionValue,
  initYAML,
  NormalArrayFormats,
  OBSIDIAN_ALIASES_KEYS,
  OBSIDIAN_TAG_KEYS,
  QuoteCharacter,
  setYamlSection,
  SpecialArrayFormats,
  splitValueIfSingleOrMultilineArray,
  TagSpecificArrayFormats,
} from '../utils/yaml';
import {isValidTag, isValidYamlKeyOnly} from '../utils/validation';

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
  @RuleBuilder.noSettingControl()
    tagArrayStyle?: TagSpecificArrayFormats | NormalArrayFormats | SpecialArrayFormats = NormalArrayFormats.SingleLine;
  @RuleBuilder.noSettingControl()
    aliasArrayStyle?: NormalArrayFormats | SpecialArrayFormats = NormalArrayFormats.SingleLine;
  @RuleBuilder.noSettingControl()
    removeUnnecessaryEscapeCharsForMultiLineArrays?: boolean = false;
}

type ObsidianListKey = 'tags' | 'aliases';

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
      const listKey = getObsidianListKey(key);
      const newValues = this.getNewValues(keyFields.map((field) => field.value).filter((value) => value !== ''), listKey, options);
      if (newValues == null) {
        continue;
      }

      const existingValue = getYamlSectionValue(existingYaml, key, false);

      // an existing array keeps its style, otherwise several values become a single-line array
      const existingArrayFormat = existingValue == null ? null : getArrayFormat(existingValue);
      let yamlValue: string;
      if (existingValue == null || options.howToHandleExistingKeys === 'Overwrite') {
        yamlValue = this.formatValues(newValues, existingArrayFormat, listKey, options);
      } else if (options.howToHandleExistingKeys === 'Merge into list') {
        let existingValues = this.getMergeableValues(existingValue);
        if (existingValues == null) {
          continue;
        } else if (listKey === 'tags') {
          existingValues = existingValues.flatMap((value) => convertTagValueToStringOrStringArray(value));
        } else if (listKey === 'aliases') {
          existingValues = existingValues.flatMap((value) => convertAliasValueToStringOrStringArray(value));
        }

        // values are compared without their quotes so that `a`, `'a'`, and `"a"` count as the same value
        const valuesPresent = new Set(existingValues.map(getScalarText));
        const valuesToAdd: string[] = [];
        for (const value of newValues) {
          if (!valuesPresent.has(getScalarText(value))) {
            valuesPresent.add(getScalarText(value));
            valuesToAdd.push(value);
          }
        }

        movedFields.push(...keyFields);
        if (valuesToAdd.length === 0) {
          // the existing value is left exactly as it is written when it already has every value
          continue;
        }

        yamlValue = this.formatValues([...existingValues, ...valuesToAdd], existingArrayFormat, listKey, options);
        yamlUpdates.push({key: this.formatKey(key, options.defaultEscapeCharacter), value: yamlValue});
        continue;
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
    // Dataview reads a value in double quotes as the text inside of them, so the quotes are kept when YAML reads it
    // the same way and otherwise the text inside of them is what gets moved
    const dataviewString = getDataviewStringContents(value);
    if (dataviewString != null) {
      if (parseYamlScalar(value) === dataviewString) {
        return value;
      }

      value = dataviewString;
    }

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
  /**
   * Gets the values to add to the YAML frontmatter for the values of the inline fields with a key.
   * @param {string[]} values The values of the inline fields
   * @param {ObsidianListKey | null} listKey Whether the key is one of Obsidian's tag or alias keys
   * @param {MoveInlineFieldsToYamlOptions} options The options of the rule
   * @return {string[] | null} The values to add or null when the values are not valid for the key
   */
  getNewValues(values: string[], listKey: ObsidianListKey | null, options: MoveInlineFieldsToYamlOptions): string[] | null {
    if (listKey === 'tags') {
      // tags are split up like they are in the tags key of the YAML frontmatter and have their hashtags removed
      // like Format tags in YAML does since Obsidian does not allow them there
      const tags = values.flatMap((value) => convertTagValueToStringOrStringArray(value)).map((tag) => tag.replace(/^#/, '')).filter((tag) => tag !== '');
      if (tags.some((tag) => !isValidTag(tag)[0])) {
        return null;
      }

      return tags;
    } else if (listKey === 'aliases') {
      values = values.flatMap((value) => convertAliasValueToStringOrStringArray(value));
    }

    return values.map((value) => this.escapeValue(value, options.defaultEscapeCharacter));
  }
  formatValues(values: string[], arrayFormat: NormalArrayFormats | null, listKey: ObsidianListKey | null, options: MoveInlineFieldsToYamlOptions): string {
    // tags and aliases always use the array style from the settings, like Format YAML array and Move tags to YAML do
    if (listKey === 'tags') {
      return formatYamlArrayValue(values, options.tagArrayStyle, options.defaultEscapeCharacter, options.removeUnnecessaryEscapeCharsForMultiLineArrays);
    } else if (listKey === 'aliases') {
      return formatYamlArrayValue(values, options.aliasArrayStyle, options.defaultEscapeCharacter, options.removeUnnecessaryEscapeCharsForMultiLineArrays, true);
    }

    const defaultEscapeCharacter = options.defaultEscapeCharacter;
    if (arrayFormat == null) {
      if (values.length === 0) {
        return '';
      } else if (values.length === 1) {
        return ' ' + values[0];
      }

      arrayFormat = NormalArrayFormats.SingleLine;
    }

    return formatYamlArrayValue(values, arrayFormat, defaultEscapeCharacter, false);
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
        description: 'Tags have their hashtags removed and tags and aliases are split up and use the tag and alias array styles from the general settings',
        before: dedent`
          tags:: #book #fiction
          aliases:: Pratchett, Sir Terry
        `,
        after: dedent`
          ---
          tags: [book, fiction]
          aliases: [Pratchett, Sir Terry]
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

function getObsidianListKey(key: string): ObsidianListKey | null {
  if (OBSIDIAN_TAG_KEYS.includes(key)) {
    return 'tags';
  } else if (OBSIDIAN_ALIASES_KEYS.includes(key)) {
    return 'aliases';
  }

  return null;
}

/**
 * Gets the array style of a YAML value.
 * @param {string} value The value of a YAML key
 * @return {NormalArrayFormats | null} The style of the array or null when the value is not an array
 */
function getArrayFormat(value: string): NormalArrayFormats | null {
  const trimmedValue = value.trim();
  if (trimmedValue.startsWith('[')) {
    return NormalArrayFormats.SingleLine;
  } else if (trimmedValue.startsWith('-') && value.startsWith('\n')) {
    return NormalArrayFormats.MultiLine;
  }

  return null;
}

function parseYamlScalar(value: string): unknown {
  try {
    return parse(value, {logLevel: 'error'}) as unknown;
  } catch {
    return undefined;
  }
}

/**
 * Gets the text of a YAML scalar without any quotes around it.
 * @param {string} value The YAML scalar as it is written
 * @return {string} The text of the scalar or the value as it is written when it is not a scalar
 */
function getScalarText(value: string): string {
  const parsedValue = parseYamlScalar(value);
  if (typeof parsedValue === 'string' || typeof parsedValue === 'number' || typeof parsedValue === 'boolean') {
    return String(parsedValue);
  }

  return value;
}

/**
 * Gets the text Dataview reads from a value in double quotes, which follows Dataview's `string` parser.
 * @param {string} value The inline field value
 * @return {string | null} The text inside of the quotes or null when the value is not a single string in double quotes
 */
function getDataviewStringContents(value: string): string | null {
  if (value.length < 2 || !value.startsWith('"') || !value.endsWith('"')) {
    return null;
  }

  let contents = '';
  for (let index = 1; index < value.length - 1; index++) {
    const char = value.charAt(index);
    if (char === '"') {
      return null;
    } else if (char === '\\') {
      index++;
      if (index >= value.length - 1) {
        return null;
      }

      const escapedChar = value.charAt(index);
      contents += escapedChar === '"' || escapedChar === '\\' ? escapedChar : '\\' + escapedChar;
    } else {
      contents += char;
    }
  }

  return contents;
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
