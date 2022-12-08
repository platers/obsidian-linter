import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {allHeadersRegex} from '../utils/regex';

class HeaderIncrementOptions implements Options {
  startAtH2?: boolean = false;
}

@RuleBuilder.register
export default class HeaderIncrement extends RuleBuilder<HeaderIncrementOptions> {
  get OptionsClass(): new () => HeaderIncrementOptions {
    return HeaderIncrementOptions;
  }
  get name(): string {
    return 'Header Increment';
  }
  get description(): string {
    return 'Heading levels should only increment by one level at a time';
  }
  get type(): RuleType {
    return RuleType.HEADING;
  }
  apply(text: string, options: HeaderIncrementOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
      let lastLevel = options.startAtH2 ? 1 : 0; // level of last header processed
      let decrement = 0; // number of levels to decrement following headers
      const minimumLevel = options.startAtH2 ? 2: 1;
      const levelOffSet = options.startAtH2 ? 1: 0;

      return text.replace(allHeadersRegex, (headerText: string, $1: string = '', $2: string = '', $3: string = '', $4: string = '', $5: string = '') => {
        let level = $2.length + levelOffSet - decrement;
        if (level > lastLevel + 1) {
          decrement += level - (lastLevel + 1);
          level = lastLevel + 1;
        } else if (level < lastLevel) {
          decrement -= lastLevel + decrement - $2.length;

          if (decrement <= 0) {
            level = $2.length;
            decrement = 0;
          }
        }

        level = level < minimumLevel ? minimumLevel : level;
        lastLevel = level;

        return $1 + '#'.repeat(level) + $3 + $4 + $5;
      });
    });
  }
  get exampleBuilders(): ExampleBuilder<HeaderIncrementOptions>[] {
    return [
      new ExampleBuilder({
        description: '',
        before: dedent`
          # H1
          ### H3
          ### H3
          #### H4
          ###### H6
          ${''}
          We skipped a 2nd level heading
        `,
        after: dedent`
          # H1
          ## H3
          ## H3
          ### H4
          #### H6
          ${''}
          We skipped a 2nd level heading
        `,
      }),
      new ExampleBuilder({
        description: 'Skipped headings in sections that would be decremented will result in those headings not having the same meaning',
        before: dedent`
          # H1
          ### H3
          ${''}
          We skip from 1 to 3
          ${''}
          ####### H7
          ${''}
          We skip from 3 to 7 leaving out 4, 5, and 6. Thus headings level 4, 5, and 6 will be treated like H3 above until another H2 or H1 is encountered
          ${''}
          ###### H6
          ${''}
          We skipped 6 previously so it will be treated the same as the H3 above since it was the next lowest header that was to be decremented
          ${''}
          ## H2
          ${''}
          This resets the decrement section so the H6 below is decremented to an H3
          ${''}
          ###### H6
        `,
        after: dedent`
          # H1
          ## H3
          ${''}
          We skip from 1 to 3
          ${''}
          ### H7
          ${''}
          We skip from 3 to 7 leaving out 4, 5, and 6. Thus headings level 4, 5, and 6 will be treated like H3 above until another H2 or H1 is encountered
          ${''}
          ## H6
          ${''}
          We skipped 6 previously so it will be treated the same as the H3 above since it was the next lowest header that was to be decremented
          ${''}
          ## H2
          ${''}
          This resets the decrement section so the H6 below is decremented to an H3
          ${''}
          ### H6
        `,
      }),
      new ExampleBuilder({
        description: 'When `Start Header Increment at Heading Level 2 = true`, H1s become H2s and the other headers are incremented accordingly',
        before: dedent`
          # H1 becomes H2
          #### H4 becomes H3
          ####### H7
          ###### H6
          ## H2
          ###### H6
          # H1
          ## H2
        `,
        after: dedent`
          ## H1 becomes H2
          ### H4 becomes H3
          #### H7
          ### H6
          ## H2
          ### H6
          ## H1
          ### H2
        `,
        options: {
          startAtH2: true,
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<HeaderIncrementOptions>[] {
    return [
      new BooleanOptionBuilder({
        OptionsClass: HeaderIncrementOptions,
        name: 'Start Header Increment at Heading Level 2',
        description: 'Makes heading level 2 the minimum heading level in a file for header increment and shifts all headings accordingly so they increment starting with a level 2 heading.',
        optionsKey: 'startAtH2',
      }),
    ];
  }
}
