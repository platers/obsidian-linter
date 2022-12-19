import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';

class TrailingSpacesOptions implements Options {
  twoSpaceLineBreak: boolean = false;
}

@RuleBuilder.register
export default class TrailingSpaces extends RuleBuilder<TrailingSpacesOptions> {
  get OptionsClass(): new () => TrailingSpacesOptions {
    return TrailingSpacesOptions;
  }
  get name(): string {
    return 'Trailing spaces';
  }
  get description(): string {
    return 'Removes extra spaces after every line.';
  }
  get type(): RuleType {
    return RuleType.SPACING;
  }
  apply(text: string, options: TrailingSpacesOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
      if (!options.twoSpaceLineBreak) {
        return text.replace(/[ \t]+$/gm, '');
      } else {
        text = text.replace(/(\S)[ \t]$/gm, '$1'); // one whitespace
        text = text.replace(/(\S)[ \t]{3,}$/gm, '$1'); // three or more whitespaces
        text = text.replace(/(\S)( ?\t\t? ?)$/gm, '$1'); // two whitespaces with at least one tab
        return text;
      }
    });
  }
  get exampleBuilders(): ExampleBuilder<TrailingSpacesOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Removes trailing spaces and tabs.',
        /* eslint-disable no-tabs */
        before: dedent`
          # H1
          Line with trailing spaces and tabs.	        ${''}
        `,
        /* eslint-enable no-tabs */
        after: dedent`
          # H1
          Line with trailing spaces and tabs.
        `,
      }),
      new ExampleBuilder({
        description: 'With `Two Space Linebreak = true`',
        before: dedent`
          # H1
          Line with trailing spaces and tabs.  ${''}
        `,
        after: dedent`
          # H1
          Line with trailing spaces and tabs.  ${''}
        `,
        options: {
          twoSpaceLineBreak: true,
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<TrailingSpacesOptions>[] {
    return [
      new BooleanOptionBuilder({
        OptionsClass: TrailingSpacesOptions,
        name: 'Two Space Linebreak',
        description: 'Ignore two spaces followed by a line break ("Two Space Rule").',
        optionsKey: 'twoSpaceLineBreak',
      }),
    ];
  }
}
