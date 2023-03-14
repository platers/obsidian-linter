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
  constructor() {
    super({
      nameKey: 'rules.header-increment.name',
      descriptionKey: 'rules.header-increment.description',
      type: RuleType.HEADING,
    });
  }
  get OptionsClass(): new () => HeaderIncrementOptions {
    return HeaderIncrementOptions;
  }
  apply(text: string, options: HeaderIncrementOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
      let lastLevel = 0; // level of last header processed
      const minimumLevel = options.startAtH2 ? 2: 1;
      const headingLevelStartNumbers: Array<number> = [];
      // These are the heading level mappings for each heading level where the index + 1 is the heading level in the file
      // the value represents the new heading level to use with 0 meaning not mapped
      const headingLevels = [0, 0, 0, 0, 0, 0];
      const highestHeadingLevel = headingLevels.length;

      return text.replace(allHeadersRegex, (_: string, $1: string = '', $2: string = '', $3: string = '', $4: string = '', $5: string = '') => {
        let level = $2.length;
        level = level <= highestHeadingLevel ? level : highestHeadingLevel;

        if (headingLevels[level - 1] >= 0 && level < lastLevel) {
          let removeLevelTo = headingLevels.length;
          while (headingLevelStartNumbers.length !== 0 && level <= headingLevelStartNumbers[headingLevelStartNumbers.length - 1]) {
            removeLevelTo = headingLevelStartNumbers.pop();
          }

          // in the rare case that a heading is lower than the first header in the file, make sure to reset all values for headers
          if (headingLevelStartNumbers.length === 0) {
            removeLevelTo = 0;
          } else {
            removeLevelTo--;
          }

          for (let i = headingLevels.length - 1; i >= removeLevelTo; i--) {
            headingLevels[i] = 0;
          }
        }

        if (headingLevels[level - 1] <= 0) {
          const startingLevelToFillIn = lastLevel;
          let newHeadingLevel = headingLevelStartNumbers.length + minimumLevel;
          newHeadingLevel = newHeadingLevel <= highestHeadingLevel ? newHeadingLevel : highestHeadingLevel;

          for (let i = startingLevelToFillIn; i < level - 1; i++) {
            headingLevels[i] = newHeadingLevel - 1;
          }

          headingLevelStartNumbers.push(level);
          headingLevels[level - 1] = newHeadingLevel;
        }

        lastLevel = level;

        return $1 + '#'.repeat(headingLevels[level - 1]) + $3 + $4 + $5;
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
          ###### H6
          ${''}
          We skip from 3 to 6 leaving out 4, 5, and 6. Thus headings level 4 and 5 will be treated like H3 above until another H2 or H1 is encountered
          ${''}
          ##### H5
          ${''}
          We skipped 5 previously so it will be treated the same as the H3 above since it was the next lowest header that was to be decremented
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
          ### H6
          ${''}
          We skip from 3 to 6 leaving out 4, 5, and 6. Thus headings level 4 and 5 will be treated like H3 above until another H2 or H1 is encountered
          ${''}
          ## H5
          ${''}
          We skipped 5 previously so it will be treated the same as the H3 above since it was the next lowest header that was to be decremented
          ${''}
          # H2
          ${''}
          This resets the decrement section so the H6 below is decremented to an H3
          ${''}
          ## H6
        `,
      }),
      new ExampleBuilder({
        description: 'When `Start Header Increment at Heading Level 2 = true`, H1s become H2s and the other headers are incremented accordingly',
        before: dedent`
          # H1 becomes H2
          #### H4 becomes H3
          ###### H6
          ## H2
          ###### H6
          # H1
          ## H2
        `,
        after: dedent`
          ## H1 becomes H2
          ### H4 becomes H3
          #### H6
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
        nameKey: 'rules.header-increment.start-at-h2.name',
        descriptionKey: 'rules.header-increment.start-at-h2.description',
        optionsKey: 'startAtH2',
      }),
    ];
  }
}
