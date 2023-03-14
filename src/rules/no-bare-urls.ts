import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {replaceTextBetweenStartAndEndWithNewValue} from '../utils/strings';
import {urlRegex} from '../utils/regex';

class NoBareUrlsOptions implements Options {}

const specialCharsToNotEscapeContentsWithin = `'"‘’“”\`[]`;

@RuleBuilder.register
export default class NoBareUrls extends RuleBuilder<NoBareUrlsOptions> {
  constructor() {
    super({
      nameKey: 'rules.no-bare-urls.name',
      descriptionKey: 'rules.no-bare-urls.description',
      type: RuleType.CONTENT,
    });
  }
  get OptionsClass(): new () => NoBareUrlsOptions {
    return NoBareUrlsOptions;
  }
  apply(text: string, options: NoBareUrlsOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag, IgnoreTypes.image, IgnoreTypes.inlineCode, IgnoreTypes.anchorTag], text, (text) => {
      const URLMatches = text.match(urlRegex);

      if (!URLMatches) {
        return text;
      }

      // make sure you do not match on the same thing more than once by keeping track of the last position you checked up to
      let startSearch = 0;
      const numMatches = URLMatches.length;
      for (let i = 0; i < numMatches; i++) {
        const urlMatch = URLMatches[i];
        const urlStart = text.indexOf(urlMatch, startSearch);
        const urlEnd = urlStart + urlMatch.length;

        const previousChar = urlStart === 0 ? undefined : text.charAt(urlStart - 1);
        const nextChar = urlEnd >= text.length ? undefined : text.charAt(urlEnd);
        if (previousChar != undefined && specialCharsToNotEscapeContentsWithin.includes(previousChar) &&
          nextChar != undefined && specialCharsToNotEscapeContentsWithin.includes(nextChar)) {
          startSearch = urlStart + urlMatch.length;
          continue;
        }

        if (previousChar != undefined && previousChar === '<' && nextChar != undefined && nextChar === '>') {
          let startOfOpeningChevrons = urlStart - 1;
          while (startOfOpeningChevrons > 0 && text.charAt(startOfOpeningChevrons-1) === '<') {
            startOfOpeningChevrons--;
          }

          let endOfClosingChevrons = urlEnd;
          while (endOfClosingChevrons < text.length -1 && text.charAt(endOfClosingChevrons+1) === '>') {
            endOfClosingChevrons++;
          }

          text = replaceTextBetweenStartAndEndWithNewValue(text, startOfOpeningChevrons, endOfClosingChevrons+1, '<' + urlMatch + '>');

          startSearch = urlStart + urlMatch.length;
          continue;
        }

        text = replaceTextBetweenStartAndEndWithNewValue(text, urlStart, urlStart + urlMatch.length, '<' + urlMatch + '>');
        startSearch = urlStart + urlMatch.length + 2;
      }

      return text;
    });
  }
  get exampleBuilders(): ExampleBuilder<NoBareUrlsOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Make sure that links are inside of angle brackets when not in single quotes(\'), double quotes("), or backticks(`)',
        before: dedent`
          https://github.com
          braces around url should stay the same: [https://github.com]
          backticks around url should stay the same: \`https://github.com\`
          Links mid-sentence should be updated like https://google.com will be.
          'https://github.com'
          "https://github.com"
          <https://github.com>
          links should stay the same: [](https://github.com)
          https://gitlab.com
        `,
        after: dedent`
          <https://github.com>
          braces around url should stay the same: [https://github.com]
          backticks around url should stay the same: \`https://github.com\`
          Links mid-sentence should be updated like <https://google.com> will be.
          'https://github.com'
          "https://github.com"
          <https://github.com>
          links should stay the same: [](https://github.com)
          <https://gitlab.com>
        `,
      }),
      new ExampleBuilder({
        description: 'Angle brackets are added if the url is not the only text in the single quotes(\') or double quotes(")',
        before: dedent`
          [https://github.com some text here]
          backticks around a url should stay the same: \`https://github.com some text here\`
          single quotes around a url should stay the same, but only if the contents of the single quotes is the url: 'https://github.com some text here'
          double quotes around a url should stay the same, but only if the contents of the double quotes is the url: "https://github.com some text here"
        `,
        after: dedent`
          [<https://github.com> some text here]
          backticks around a url should stay the same: \`https://github.com some text here\`
          single quotes around a url should stay the same, but only if the contents of the single quotes is the url: '<https://github.com> some text here'
          double quotes around a url should stay the same, but only if the contents of the double quotes is the url: "<https://github.com> some text here"
        `,
      }),
      new ExampleBuilder({
        description: 'Multiple angle brackets at the start and or end of a url will be reduced down to 1',
        before: dedent`
          <<https://github.com>
          <https://google.com>>
          <<https://gitlab.com>>
        `,
        after: dedent`
          <https://github.com>
          <https://google.com>
          <https://gitlab.com>
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<NoBareUrlsOptions>[] {
    return [];
  }
}
