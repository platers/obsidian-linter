import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, ExampleBuilder, OptionBuilderBase, TextAreaOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {tagRegex} from '../utils/regex';
import {
  convertTagValueToStringOrStringArray,
  getYamlSectionValue,
  setYamlSection,
  splitValueIfSingleOrMultilineArray,
  formatYamlArrayValue,
  initYAML,
  formatYAML,
  OBSIDIAN_TAG_KEY,
  NormalArrayFormats,
  SpecialArrayFormats,
  TagSpecificArrayFormats,
} from '../utils/yaml';

class MoveTagsToYamlOptions implements Options {
  @RuleBuilder.noSettingControl()
    tagArrayStyle? : TagSpecificArrayFormats | NormalArrayFormats | SpecialArrayFormats = NormalArrayFormats.SingleLine;
  removeHashtagsFromTagsInBody?: boolean = false;
  tagsToIgnore?: string[] = [];
}

@RuleBuilder.register
export default class MoveTagsToYaml extends RuleBuilder<MoveTagsToYamlOptions> {
  get OptionsClass(): new () => MoveTagsToYamlOptions {
    return MoveTagsToYamlOptions;
  }
  get name(): string {
    return 'Move Tags to Yaml';
  }
  get description(): string {
    return 'Move all tags to Yaml frontmatter of the document.';
  }
  get type(): RuleType {
    return RuleType.YAML;
  }
  apply(text: string, options: MoveTagsToYamlOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.inlineCode, IgnoreTypes.math], text, (text) => {
      const tags = text.match(tagRegex);
      if (!tags) {
        return text;
      }

      text = initYAML(text);
      text = formatYAML(text, (text: string) => {
        text = text.replace('---\n', '').replace('---', '');

        let tagValue = convertTagValueToStringOrStringArray(splitValueIfSingleOrMultilineArray(getYamlSectionValue(text, OBSIDIAN_TAG_KEY)));
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

        const newYaml = setYamlSection(text, OBSIDIAN_TAG_KEY, formatYamlArrayValue(tagValue, options.tagArrayStyle));

        return `---\n${newYaml}---`;
      });

      if (options.removeHashtagsFromTagsInBody) {
        text = text.replace(tagRegex, (tag: string) => {
          const hashtagIndex = tag.indexOf('#');

          const tagContents = tag.substring(hashtagIndex+1);
          if (options.tagsToIgnore.includes(tagContents)) {
            return tag;
          }

          return tag.substring(0, hashtagIndex) + tagContents;
        });
      }

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
        description: 'Move tags from body to Yaml with existing tags retains the already existing ones and only adds new ones',
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
        description: 'Move tags to Yaml frontmatter and then remove hashtags in body content tags `Remove the hashtag from tags in content body = true` with `Tags to ignore = \'yet-another-ignored-tag\'`.',
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
          removeHashtagsFromTagsInBody: true,
          tagsToIgnore: ['yet-another-ignored-tag'],
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<MoveTagsToYamlOptions>[] {
    return [
      new BooleanOptionBuilder({
        OptionsClass: MoveTagsToYamlOptions,
        name: 'Remove the hashtag from tags in content body',
        description: 'Removes `#` from tags in content body after moving them to the Yaml frontmatter',
        optionsKey: 'removeHashtagsFromTagsInBody',
      }),
      new TextAreaOptionBuilder({
        OptionsClass: MoveTagsToYamlOptions,
        name: 'Tags to ignore',
        description: 'The tags that will not be moved to the tags array or removed from the body content if `Remove the hashtag from tags in content body` is enabled. Each tag should be on a new line and without the `#`. **Make sure not to include the hashtag in the tag name.**',
        optionsKey: 'tagsToIgnore',
      }),
    ];
  }
}
