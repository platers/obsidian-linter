import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {splitYamlAndBody} from '../utils/yaml';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';

class RemoveHorizontalRulesOutsideYamlOptions implements Options {}

@RuleBuilder.register
export default class RemoveHorizontalRulesOutsideYaml extends RuleBuilder<RemoveHorizontalRulesOutsideYamlOptions> {
  constructor() {
    super({
      nameKey: 'rules.remove-horizontal-rules-outside-yaml.name',
      descriptionKey: 'rules.remove-horizontal-rules-outside-yaml.description',
      type: RuleType.SPACING,
      ruleIgnoreTypes: [
        IgnoreTypes.code,
        IgnoreTypes.inlineCode,
        IgnoreTypes.math,
        IgnoreTypes.inlineMath,
        IgnoreTypes.table,
      ],
    });
  }
  get OptionsClass(): new () => RemoveHorizontalRulesOutsideYamlOptions {
    return RemoveHorizontalRulesOutsideYamlOptions;
  }
  apply(
      text: string,
      options: RemoveHorizontalRulesOutsideYamlOptions,
  ): string {
    const {yaml, body} = splitYamlAndBody(text);

    // Remove lines that match ^\s*---\s*$ (only horizontal rule separators)
    // Use ignoreListOfTypes to skip code blocks, tables, etc.
    const processedBody = ignoreListOfTypes(
        [
          IgnoreTypes.code,
          IgnoreTypes.inlineCode,
          IgnoreTypes.math,
          IgnoreTypes.inlineMath,
          IgnoreTypes.table,
        ],
        body,
        (text: string): string => {
        // Remove lines that are only --- with optional whitespace
        // Replace \n---\n with \n to preserve newline structure
          const horizontalRuleRegex = /^\s*---\s*$/gm;
          // Replace newline + --- + newline with just newline (preserve spacing)
          text = text.replace(
              new RegExp('\\n' + horizontalRuleRegex.source + '\\n', 'gm'),
              '\n',
          );
          // Remove --- at start of body (no preceding newline)
          text = text.replace(
              new RegExp('^' + horizontalRuleRegex.source + '\\n', 'gm'),
              '',
          );
          // Remove --- at end of body (no following newline)
          text = text.replace(
              new RegExp('\\n' + horizontalRuleRegex.source + '$', 'gm'),
              '',
          );
          // Remove standalone --- (entire body is just ---)
          return text.replace(
              new RegExp('^' + horizontalRuleRegex.source + '$', 'gm'),
              '',
          );
        },
    );

    // Reassemble: if YAML exists, prepend it; otherwise just return processed body
    return yaml ? yaml + processedBody : processedBody;
  }
  get exampleBuilders(): ExampleBuilder<RemoveHorizontalRulesOutsideYamlOptions>[] {
    return [
      new ExampleBuilder({
        description:
          'Removes `---` from body content while preserving YAML frontmatter fences',
        before: dedent`
          ---
          prop: value
          ---
          Content before separator
          ---
          Content after separator
        `,
        after: dedent`
          ---
          prop: value
          ---
          Content before separator
          Content after separator
        `,
      }),
      new ExampleBuilder({
        description: 'Preserves YAML frontmatter fences exactly',
        before: dedent`
          ---
          title: My Document
          tags: [note, important]
          ---
          ---
          Some content here
        `,
        after: dedent`
          ---
          title: My Document
          tags: [note, important]
          ---
          Some content here
        `,
      }),
      new ExampleBuilder({
        description: 'Removes `---` from files without YAML frontmatter',
        before: dedent`
          Content before
          ---
          Content after
          ---
          More content
        `,
        after: dedent`
          Content before
          Content after
          More content
        `,
      }),
      new ExampleBuilder({
        description: 'Does not remove `---` from tables',
        before: dedent`
          | Column 1 | Column 2 |
          | --- | --- |
          | Data 1 | Data 2 |
        `,
        after: dedent`
          | Column 1 | Column 2 |
          | --- | --- |
          | Data 1 | Data 2 |
        `,
      }),
      new ExampleBuilder({
        description: 'Does not remove `---` from code blocks',
        before: dedent`
          \`\`\`
          Some code here
          ---
          More code
          \`\`\`
        `,
        after: dedent`
          \`\`\`
          Some code here
          ---
          More code
          \`\`\`
        `,
      }),
      new ExampleBuilder({
        description: 'Handles `---` with surrounding whitespace',
        before: dedent`
          Content before
            ---  
          Content after
        `,
        after: dedent`
          Content before
          Content after
        `,
      }),
      new ExampleBuilder({
        description: 'Handles multiple `---` lines in body',
        before: dedent`
          ---
          title: Test
          ---
          First section
          ---
          Second section
          ---
          Third section
        `,
        after: dedent`
          ---
          title: Test
          ---
          First section
          Second section
          Third section
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<RemoveHorizontalRulesOutsideYamlOptions>[] {
    return [];
  }
}
