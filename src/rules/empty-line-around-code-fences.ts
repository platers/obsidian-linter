import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {ensureEmptyLinesAroundFencedCodeBlocks} from '../utils/mdast';

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
    return ensureEmptyLinesAroundFencedCodeBlocks(text);
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
          ${''}
          Text after code block.
        `,
      }),
      new ExampleBuilder({
        description: 'Fenced code blocks that end a document do not get an empty line after them.',
        before: dedent`
          # Heading 1
          \`\`\`
          Here is a code block
          \`\`\`
        `,
        after: dedent`
          # Heading 1
          ${''}
          \`\`\`
          Here is a code block
          \`\`\`
        `,
      }),
      new ExampleBuilder({
        // accounts for https://github.com/platers/obsidian-linter/issues/299
        description: 'Fenced code blocks that are in a blockquote have the proper empty line added',
        before: dedent`
          # Make sure that code blocks in blockquotes are accounted for correctly
          > \`\`\`js
          > var text = 'this is some text';
          > \`\`\`
          >
          > \`\`\`js
          > var other text = 'this is more text';
          > \`\`\`
          ${''}
          **Note that the blanks blockquote lines added do not have whitespace after them**
          ${''}
          # Doubly nested code block
          ${''}
          > > \`\`\`js
          > > var other text = 'this is more text';
          > > \`\`\`
        `,
        after: dedent`
          # Make sure that code blocks in blockquotes are accounted for correctly
          >
          > \`\`\`js
          > var text = 'this is some text';
          > \`\`\`
          >
          > \`\`\`js
          > var other text = 'this is more text';
          > \`\`\`
          >
          ${''}
          **Note that the blanks blockquote lines added do not have whitespace after them**
          ${''}
          # Doubly nested code block
          ${''}
          > >
          > > \`\`\`js
          > > var other text = 'this is more text';
          > > \`\`\`
        `,
      }),
      new ExampleBuilder({
        description: 'Nested fenced code blocks get empty lines added around them',
        before: dedent`
          \`\`\`markdown
          # Header
          ${''}
          \`\`\`\`JavaScript
          var text = 'some string';
          \`\`\`\`
          \`\`\`
        `,
        after: dedent`
          \`\`\`markdown
          # Header
          ${''}
          \`\`\`\`JavaScript
          var text = 'some string';
          \`\`\`\`
          ${''}
          \`\`\`
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<EmptyLineAroundCodeFencesOptions>[] {
    return [];
  }
}
