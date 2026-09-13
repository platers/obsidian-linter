import {Options, RuleType} from '../rules';
import RuleBuilder, {DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase, TextAreaOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {IgnoreTypes} from '../utils/ignore-types';
import {tagWithLeadingWhitespaceRegex} from '../utils/regex';
import {ProtectedRanges} from '../utils/protected-ranges';
import {replaceTextRanges, textReplacement} from '../utils/strings';
import {getEditsBetween} from '../utils/text-edits';
import {
  convertTagValueToStringOrStringArray,
  getYamlSectionValue,
  setYamlSection,
  splitValueIfSingleOrMultilineArray,
  formatYamlArrayValue,
  initYAML,
  formatYAML,
  OBSIDIAN_TAG_KEYS,
  NormalArrayFormats,
  SpecialArrayFormats,
  TagSpecificArrayFormats,
  OBSIDIAN_TAG_KEY_PLURAL,
  QuoteCharacter,
} from '../utils/yaml';

type tagOperations = 'Nothing' | 'Remove hashtag' | 'Remove whole tag';

class MoveTagsToYamlOptions implements Options {
  @RuleBuilder.noSettingControl()
    tagArrayStyle? : TagSpecificArrayFormats | NormalArrayFormats | SpecialArrayFormats = NormalArrayFormats.SingleLine;
  howToHandleExistingTags?: tagOperations = 'Nothing';
  tagsToIgnore?: string[] = [];
  @RuleBuilder.noSettingControl()
    defaultEscapeCharacter?: QuoteCharacter = '"';
  @RuleBuilder.noSettingControl()
    removeUnnecessaryEscapeCharsForMultiLineArrays?: boolean = false;
}

@RuleBuilder.register
export default class MoveTagsToYaml extends RuleBuilder<MoveTagsToYamlOptions> {
  constructor() {
    super({
      nameKey: 'rules.move-tags-to-yaml.name',
      descriptionKey: 'rules.move-tags-to-yaml.description',
      type: RuleType.YAML,
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.inlineCode, IgnoreTypes.math, IgnoreTypes.html, IgnoreTypes.wikiLink, IgnoreTypes.link],
    });
  }
  get OptionsClass(): new () => MoveTagsToYamlOptions {
    return MoveTagsToYamlOptions;
  }
  apply(text: string, options: MoveTagsToYamlOptions, protectedRanges: ProtectedRanges): string {
    const projection = protectedRanges.projection();
    const bodyProjection = protectedRanges.combinedWith([IgnoreTypes.yaml]).projection();
    // need to ignore YAML when getting regex matches to avoid improper matches with YAML contents
    // https://github.com/platers/obsidian-linter/issues/661
    const tagMatches = [...bodyProjection.text.matchAll(tagWithLeadingWhitespaceRegex)].filter((match) => {
      return bodyProjection.editRangeToSource({startIndex: match.index, endIndex: match.index + match[0].length}) !== undefined;
    });
    const tags = tagMatches.map((match) => match[2]);

    if (tags.length === 0) {
      return text;
    }

    text = initYAML(projection.text);
    text = formatYAML(text, (text: string) => {
      text = text.replace('---\n', '').replace('---', '');

      let tagValue: string[] = [];
      let existingTagKey = OBSIDIAN_TAG_KEY_PLURAL;

      for (const tagKey of OBSIDIAN_TAG_KEYS) {
        const tempTagValue = getYamlSectionValue(text, tagKey);
        if (tempTagValue != null) {
          tagValue = convertTagValueToStringOrStringArray(splitValueIfSingleOrMultilineArray(tempTagValue));
          existingTagKey = tagKey;

          break;
        }
      }

      const existingTags = new Set<string>();
      if (typeof tagValue === 'string') {
        existingTags.add(tagValue);
        tagValue = [tagValue];
      } else if (tagValue != undefined) {
        for (const tag of tagValue) {
          existingTags.add(tag);
        }
      } else {
        tagValue = [];
      }

      for (const tag of tags) {
        const tagContent = tag.trim().substring(1);
        if (!existingTags.has(tagContent) && !options.tagsToIgnore.includes(tagContent)) {
          existingTags.add(tagContent);
          tagValue.push(tagContent);
        }
      }

      const newYaml = setYamlSection(text, existingTagKey, formatYamlArrayValue(tagValue, options.tagArrayStyle, options.defaultEscapeCharacter, options.removeUnnecessaryEscapeCharsForMultiLineArrays));

      return `---\n${newYaml}---`;
    });

    const removals: textReplacement[] = [];
    const yamlLengthChange = text.length - projection.text.length;
    if (options.howToHandleExistingTags !== 'Nothing') {
      for (const match of tagMatches) {
        if (options.tagsToIgnore.includes(match[2].substring(1))) {
          continue;
        }
        const sourceRange = bodyProjection.editRangeToSource({startIndex: match.index, endIndex: match.index + match[0].length});
        let startIndex = projection.sourceToProjection(sourceRange.startIndex) + yamlLengthChange;
        const endIndex = projection.sourceToProjection(sourceRange.endIndex) + yamlLengthChange;
        if (options.howToHandleExistingTags === 'Remove hashtag') {
          startIndex += match[1].length;
          removals.push({startIndex, endIndex: startIndex + 1, value: ''});
        } else {
          // A newly inserted frontmatter supplies the leading newline for a tag at offset zero.
          if (match.index === 0 && match[1] === '' && yamlLengthChange > 0) {
            startIndex--;
          }
          removals.push({startIndex, endIndex, value: ''});
        }
      }
    }
    removals.sort((a, b) => a.startIndex - b.startIndex || a.endIndex - b.endIndex);
    if (removals.some((replacement, index) => index > 0 && replacement.startIndex < removals[index - 1].endIndex)) {
      throw new Error('Rule replacements must be ordered and non-overlapping');
    }
    text = replaceTextRanges(text, removals);

    // Make sure that the YAML frontmatter does not have whitespace added after the end of the YAML frontmatter.
    // This accounts for https://github.com/platers/obsidian-linter/issues/573
    text = text.replace(/(\n---)( |\t)+/, '$1');

    const replacements: textReplacement[] = [];
    for (const edit of getEditsBetween(projection.text, text)) {
      const range = projection.editRangeToSource(edit);
      if (range) {
        replacements.push({...range, value: edit.value});
      }
    }
    replacements.sort((a, b) => a.startIndex - b.startIndex || a.endIndex - b.endIndex);
    if (replacements.some((replacement, index) => index > 0 && replacement.startIndex < replacements[index - 1].endIndex)) {
      throw new Error('Rule replacements must be ordered and non-overlapping');
    }
    return replaceTextRanges(projection.source, replacements);
  }
  get exampleBuilders(): ExampleBuilder<MoveTagsToYamlOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Move tags from body to YAML with `Tags to ignore = \'ignored-tag\'`',
        before: dedent`
          Text has to do with #test and #markdown
          ${''}
          #test content here
          \`\`\`
          #ignored
          Code block content is ignored
          \`\`\`
          ${''}
          This inline code \`#ignored content\`
          ${''}
          #ignored-tag is ignored since it is in the ignored list
        `,
        after: dedent`
          ---
          tags: [test, markdown]
          ---
          Text has to do with #test and #markdown
          ${''}
          #test content here
          \`\`\`
          #ignored
          Code block content is ignored
          \`\`\`
          ${''}
          This inline code \`#ignored content\`
          ${''}
          #ignored-tag is ignored since it is in the ignored list
        `,
        options: {
          tagsToIgnore: ['ignored-tag'],
        },
      }),
      new ExampleBuilder({
        description: 'Move tags from body to YAML with existing tags retains the already existing ones and only adds new ones',
        before: dedent`
          ---
          tags: [test, tag2]
          ---
          Text has to do with #test and #markdown
        `,
        after: dedent`
          ---
          tags: [test, tag2, markdown]
          ---
          Text has to do with #test and #markdown
        `,
      }),
      new ExampleBuilder({
        description: 'Move tags to YAML frontmatter and then remove hashtags in body content tags when `Body tag operation = \'Remove hashtag\'` and `Tags to ignore = \'yet-another-ignored-tag\'`.',
        before: dedent`
          ---
          tags: [test, tag2]
          ---
          Text has to do with #test and #markdown
          ${''}
          The tag at the end of this line stays as a tag since it is ignored #yet-another-ignored-tag
        `,
        after: dedent`
          ---
          tags: [test, tag2, markdown]
          ---
          Text has to do with test and markdown
          ${''}
          The tag at the end of this line stays as a tag since it is ignored #yet-another-ignored-tag
        `,
        options: {
          howToHandleExistingTags: 'Remove hashtag',
          tagsToIgnore: ['yet-another-ignored-tag'],
        },
      }),
      new ExampleBuilder({
        description: 'Move tags to YAML frontmatter and then remove body content tags when `Body tag operation = \'Remove whole tag\'`.',
        before: dedent`
          ---
          tags: [test, tag2]
          ---
          This document will have #tags removed and spacing around tags is left alone except for the space prior to the hashtag #warning
        `,
        after: dedent`
          ---
          tags: [test, tag2, tags, warning]
          ---
          This document will have removed and spacing around tags is left alone except for the space prior to the hashtag
        `,
        options: {
          howToHandleExistingTags: 'Remove whole tag',
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<MoveTagsToYamlOptions>[] {
    return [
      new DropdownOptionBuilder({
        OptionsClass: MoveTagsToYamlOptions,
        nameKey: 'rules.move-tags-to-yaml.how-to-handle-existing-tags.name',
        descriptionKey: 'rules.move-tags-to-yaml.how-to-handle-existing-tags.description',
        optionsKey: 'howToHandleExistingTags',
        records: [
          {
            value: 'Nothing',
            description: 'Leaves tags in the body of the file alone',
          },
          {
            value: 'Remove hashtag',
            description: 'Removes `#` from tags in content body after moving them to the YAML frontmatter',
          },
          {
            value: 'Remove whole tag',
            description: 'Removes the whole tag in content body after moving them to the YAML frontmatter. _Note that this removes the first space prior to the tag as well_',
          },
        ],
      }),
      new TextAreaOptionBuilder({
        OptionsClass: MoveTagsToYamlOptions,
        nameKey: 'rules.move-tags-to-yaml.tags-to-ignore.name',
        descriptionKey: 'rules.move-tags-to-yaml.tags-to-ignore.description',
        optionsKey: 'tagsToIgnore',
      }),
    ];
  }
}
