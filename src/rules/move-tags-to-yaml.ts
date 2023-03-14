import {Options, RuleType} from '../rules';
import RuleBuilder, {DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase, TextAreaOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {matchTagRegex, tagWithLeadingWhitespaceRegex} from '../utils/regex';
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
} from '../utils/yaml';

type tagOperations = 'Nothing' | 'Remove hashtag' | 'Remove whole tag';

class MoveTagsToYamlOptions implements Options {
  @RuleBuilder.noSettingControl()
    tagArrayStyle? : TagSpecificArrayFormats | NormalArrayFormats | SpecialArrayFormats = NormalArrayFormats.SingleLine;
  howToHandleExistingTags?: tagOperations = 'Nothing';
  tagsToIgnore?: string[] = [];
  @RuleBuilder.noSettingControl()
    defaultEscapeCharacter?: string = '"';
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
    });
  }
  get OptionsClass(): new () => MoveTagsToYamlOptions {
    return MoveTagsToYamlOptions;
  }
  apply(text: string, options: MoveTagsToYamlOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.inlineCode, IgnoreTypes.math, IgnoreTypes.html, IgnoreTypes.wikiLink, IgnoreTypes.link], text, (text) => {
      const tags = matchTagRegex(text);
      if (tags.length === 0) {
        return text;
      }

      text = initYAML(text);
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

      if (options.howToHandleExistingTags !== 'Nothing') {
        text = text.replace(tagWithLeadingWhitespaceRegex, (tag: string) => {
          const hashtagIndex = tag.indexOf('#');

          const tagContents = tag.substring(hashtagIndex+1);
          if (options.tagsToIgnore.includes(tagContents)) {
            return tag;
          }

          if (options.howToHandleExistingTags === 'Remove hashtag') {
            return tag.substring(0, hashtagIndex) + tagContents;
          }

          return '';
        });
      }

      // Make sure that the yaml frontmatter does not have whitespace added after the end of the yaml frontmatter.
      // This accounts for https://github.com/platers/obsidian-linter/issues/573
      text = text.replace(/(\n---)( |\t)+/, '$1');

      return text;
    });
  }
  get exampleBuilders(): ExampleBuilder<MoveTagsToYamlOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Move tags from body to Yaml with `Tags to ignore = \'ignored-tag\'`',
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
