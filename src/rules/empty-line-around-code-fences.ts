import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {ensureEmptyLinesAroundRegexMatches} from '../utils/regex';

class EmptyLineAroundCodeFencesOptions implements Options {
}

@RuleBuilder.register
export default class EmptyLineAroundCodeFences extends RuleBuilder<EmptyLineAroundCodeFencesOptions> {
  get OptionsClass(): new () => EmptyLineAroundCodeFencesOptions {
    return EmptyLineAroundCodeFencesOptions;
  }
  get name(): string {
    return 'Empty Line Around Code Fences';
  }
  get description(): string {
    return 'Ensures that there is an empty line around code fences unless they start or end a document.';
  }
  get type(): RuleType {
    return RuleType.SPACING;
  }
  apply(text: string, options: EmptyLineAroundCodeFencesOptions): string {
    return ensureEmptyLinesAroundRegexMatches(text, /(^|(\n+)?)`{3}( ?[\S]+)?\n([\s\S]+)\n`{3}(\n+)?/gm);
  }
  get exampleBuilders(): ExampleBuilder<EmptyLineAroundCodeFencesOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Fenced code blocks that start a document do not get an empty line before them.',
        before: dedent`
          \`\`\` js
          var temp = 'text';
          // this is a code block
          \`\`\`
          Text after code block.
        `,
        after: dedent`
          \`\`\` js
          var temp = 'text';
          // this is a code block
          \`\`\`

          Text after code block.
        `,
      }),
      new ExampleBuilder({
        description: 'Fenced code blocs that end a document do not get an empty line after them.',
        before: dedent`
          # Heading 1
          \`\`\`
          Here is a code block
          \`\`\`
        `,
        after: dedent`
          # Heading 1

          \`\`\`
          Here is a code block
          \`\`\`
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilder<EmptyLineAroundCodeFencesOptions, any>[] {
    return [];
  }
}
