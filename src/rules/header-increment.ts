import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {headerRegex} from '../utils/regex';

class HeaderIncrementOptions implements Options {
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
      const lines = text.split('\n');
      let lastLevel = 0; // level of last header processed
      let decrement = 0; // number of levels to decrement following headers
      for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(headerRegex);
        if (!match) {
          continue;
        }

        let level = match[2].length - decrement;
        if (level > lastLevel + 1) {
          decrement += level - (lastLevel + 1);
          level = lastLevel + 1;
        } else if (level < lastLevel) {
          decrement -= lastLevel + decrement - match[2].length;

          if (decrement <= 0) {
            level = match[2].length;
            decrement = 0;
          }
        }

        lines[i] = lines[i].replace(
            headerRegex,
            `$1${'#'.repeat(level)}$3$4`,
        );
        lastLevel = level;
      }
      return lines.join('\n');
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

          We skipped a 2nd level heading
        `,
        after: dedent`
          # H1
          ## H3
          ## H3
          ### H4
          #### H6

          We skipped a 2nd level heading
        `,
      }),
      new ExampleBuilder({
        description: 'Skipped headings in sections that would be decremented will result in those headings not having the same meaning',
        before: dedent`
          # H1
          ### H3

          We skip from 1 to 3

          ####### H7

          We skip from 3 to 7 leaving out 4, 5, and 6. Thus headings level 4, 5, and 6 will be treated like H3 above until another H2 or H1 is encountered

          ###### H6

          We skipped 6 previously so it will be treated the same as the H3 above since it was the next lowest header that was to be decremented

          ## H2

          This resets the decrement section so the H6 below is decremented to an H3

          ###### H6
          `,
        after: dedent`
          # H1
          ## H3

          We skip from 1 to 3

          ### H7

          We skip from 3 to 7 leaving out 4, 5, and 6. Thus headings level 4, 5, and 6 will be treated like H3 above until another H2 or H1 is encountered

          ## H6

          We skipped 6 previously so it will be treated the same as the H3 above since it was the next lowest header that was to be decremented

          ## H2

          This resets the decrement section so the H6 below is decremented to an H3

          ### H6
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<HeaderIncrementOptions>[] {
    return [];
  }
}
