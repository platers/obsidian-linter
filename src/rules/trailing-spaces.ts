import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {updateListItemText} from '../utils/mdast';

class TrailingSpacesOptions implements Options {
  twoSpaceLineBreak: boolean = false;
}

@RuleBuilder.register
export default class TrailingSpaces extends RuleBuilder<TrailingSpacesOptions> {
  constructor() {
    super({
      nameKey: 'rules.trailing-spaces.name',
      descriptionKey: 'rules.trailing-spaces.description',
      type: RuleType.SPACING,
      hasSpecialExecutionOrder: true, // run after all other possible rules to make sure trailing spaces are properly removed
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag],
    });
  }
  get OptionsClass(): new () => TrailingSpacesOptions {
    return TrailingSpacesOptions;
  }
  apply(text: string, options: TrailingSpacesOptions): string {
    text = ignoreListOfTypes([IgnoreTypes.list], text, (text: string): string => {
      if (!options.twoSpaceLineBreak) {
        return text.replace(/[ \t]+$/gm, '');
      } else {
        text = text.replace(/(\S)[ \t]$/gm, '$1'); // one whitespace
        text = text.replace(/(\S)[ \t]{3,}$/gm, '$1'); // three or more whitespaces
        text = text.replace(/(\S)( ?\t\t? ?)$/gm, '$1'); // two whitespaces with at least one tab
        return text;
      }
    });

    return updateListItemText(text, (text: string): string => {
      if (!options.twoSpaceLineBreak) {
        return text.replace(/[ \t]+$/gm, '');
      } else {
        text = text.replace(/(\S)[ \t]$/gm, '$1'); // one whitespace
        text = text.replace(/(\S)[ \t]{3,}$/gm, '$1'); // three or more whitespaces
        text = text.replace(/(\S)( ?\t\t? ?)$/gm, '$1'); // two whitespaces with at least one tab
        return text;
      }
    }, true);
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
        nameKey: 'rules.trailing-spaces.two-space-line-break.name',
        descriptionKey: 'rules.trailing-spaces.two-space-line-break.description',
        optionsKey: 'twoSpaceLineBreak',
      }),
    ];
  }
}
