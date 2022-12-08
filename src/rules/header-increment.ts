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

      return text.replace(allHeadersRegex, (headerText: string, $1: string = '', $2: string = '', $3: string = '', $4: string = '', $5: string = '') => {
        // skip any headers with a header level less than the minimum
        if ($2.length < minimumLevel) {
          lastLevel = minimumLevel - 1; // makes sure that header increment starts off at the minimum level if the last level was greater than it
          return headerText;
        }

        let level = $2.length - decrement;
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
        description: 'When start at heading level 2 is set to true, H1s are left alone and the next header will be an H2',
        before: dedent`
          # H1 stays the same
          ### H3 becomes H2
          ####### H7
          ###### H6
          ## H2
          ###### H6
          # H1
          ####### H7
        `,
        after: dedent`
          # H1 stays the same
          ## H3 becomes H2
          ### H7
          ## H6
          ## H2
          ### H6
          # H1
          ## H7
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
        description: 'Ignores level 1 headings and makes sure that level 1 headings are followed by an level 2 heading',
        optionsKey: 'startAtH2',
      }),
    ];
  }
}
