import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {IgnoreTypes} from '../utils/ignore-types';
import {countInstances, replaceTextBetweenStartAndEndWithNewValue} from '../utils/strings';
import {simpleURIRegex, urlRegex} from '../utils/regex';

class NoBareUrlsOptions implements Options {
  noBareURIs?: boolean = false;
}

const specialCharsToNotEscapeContentsWithin = `'"‘’“”\`[]`;
const uriSchemesToIgnore = ['http', 'ftp', 'https', 'smtp'];

@RuleBuilder.register
export default class NoBareUrls extends RuleBuilder<NoBareUrlsOptions> {
  constructor() {
    super({
      nameKey: 'rules.no-bare-urls.name',
      descriptionKey: 'rules.no-bare-urls.description',
      type: RuleType.CONTENT,
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag, IgnoreTypes.image, IgnoreTypes.inlineCode, IgnoreTypes.anchorTag, IgnoreTypes.html],
    });
  }
  get OptionsClass(): new () => NoBareUrlsOptions {
    return NoBareUrlsOptions;
  }
  apply(text: string, options: NoBareUrlsOptions): string {
    const URLMatches = text.match(urlRegex);
    if (URLMatches) {
      text = this.handleMatches(text, URLMatches, false);
    }


    if (options.noBareURIs) {
      const URIMatches = text.match(simpleURIRegex);
      if (URIMatches) {
        text = this.handleMatches(text, URIMatches, true);
      }
    }

    return text;
  }
  handleMatches(text: string, matches: RegExpMatchArray, isURISearch: boolean): string {
    // make sure you do not match on the same thing more than once by keeping track of the last position you checked up to
    let startSearch = 0;
    const numMatches = matches.length;
    for (let i = 0; i < numMatches; i++) {
      let urlMatch = matches[i];
      let urlStart = text.indexOf(urlMatch, startSearch);
      let urlEnd = urlStart + urlMatch.length;
      if (urlMatch.charAt(0) === '<') {
        urlMatch = urlMatch.substring(1);
        urlStart++;
      }

      if (urlMatch.charAt(urlMatch.length - 1) === '>') {
        urlMatch = urlMatch.substring(0, urlMatch.length - 1);
        urlEnd--;
      }

      const previousChar = urlStart === 0 ? undefined : text.charAt(urlStart - 1);
      let nextChar = urlEnd >= text.length ? undefined : text.charAt(urlEnd);
      // check for an unmatched opening paren
      const openingParentheses = countInstances(urlMatch, '(');
      if (openingParentheses != 0 && openingParentheses != countInstances(urlMatch, ')') && nextChar == ')') {
        urlMatch += nextChar;
        urlEnd++;
        nextChar = urlEnd >= text.length ? undefined : text.charAt(urlEnd);
      } else if (openingParentheses == 0 && urlMatch.endsWith(')')) {
        nextChar = ')';
        urlEnd--;
        urlMatch = urlMatch.substring(0, urlMatch.length -1);
      }

      if (this.skipMatch(previousChar, nextChar, urlMatch, isURISearch)) {
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
  }
  skipMatch(previousChar: string, nextChar: string, match: string, isURISearch: boolean) {
    const startsWithSpecialCharacter = (previousChar != undefined && specialCharsToNotEscapeContentsWithin.includes(previousChar)) || specialCharsToNotEscapeContentsWithin.includes(match.charAt(0));
    const endsWithSpecialCharacter = (nextChar != undefined && specialCharsToNotEscapeContentsWithin.includes(nextChar)) || specialCharsToNotEscapeContentsWithin.includes(match.charAt(match.length - 1));
    if (startsWithSpecialCharacter && endsWithSpecialCharacter) {
      return true;
    }

    if (isURISearch) {
      return uriSchemesToIgnore.includes(match.substring(0, match.indexOf(':')));
    }

    return false;
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
      new ExampleBuilder({// accounts for https://github.com/platers/obsidian-linter/issues/776
        description: 'Puts angle brackets around URIs when `No Bare URIs` is enabled',
        before: dedent`
          obsidian://show-plugin?id=cycle-in-sidebar
        `,
        after: dedent`
          <obsidian://show-plugin?id=cycle-in-sidebar>
        `,
        options: {
          noBareURIs: true,
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<NoBareUrlsOptions>[] {
    return [
      new BooleanOptionBuilder({
        OptionsClass: NoBareUrlsOptions,
        nameKey: 'rules.no-bare-urls.no-bare-uris.name',
        descriptionKey: 'rules.no-bare-urls.no-bare-uris.description',
        optionsKey: 'noBareURIs',
      }),
    ];
  }
}
