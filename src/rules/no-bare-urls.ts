import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {IgnoreTypes} from '../utils/ignore-types';
import {countInstances, replaceTextRanges, textReplacement} from '../utils/strings';
import {simpleURIRegex, urlRegex} from '../utils/regex';
import {ProtectedRanges, redactProtected} from '../utils/protected-ranges';

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
  apply(text: string, options: NoBareUrlsOptions, protectedRanges: ProtectedRanges): string {
    const replacements: textReplacement[] = [];
    const URLMatches = text.match(urlRegex);
    if (URLMatches) {
      replacements.push(...this.handleMatches(text, URLMatches, false, protectedRanges));
    }

    if (options.noBareURIs) {
      const URIMatches = text.match(simpleURIRegex);
      if (URIMatches) {
        const urlReplacements = new ProtectedRanges(replacements);
        for (const replacement of this.handleMatches(text, URIMatches, true, protectedRanges)) {
          // The URL pass already wraps these characters before the URI pass would see them.
          // URI edits are disjoint within handleMatches; only the URL edits need indexing.
          if (!urlReplacements.isProtected(replacement.startIndex, replacement.endIndex)) {
            replacements.push(replacement);
          }
        }
      }
    }

    replacements.sort((a, b) => a.startIndex - b.startIndex || a.endIndex - b.endIndex);
    if (replacements.some((replacement, index) => index > 0 && replacement.startIndex < replacements[index - 1].endIndex)) {
      throw new Error('Rule replacements must be ordered and non-overlapping');
    }
    return replaceTextRanges(text, replacements);
  }
  handleMatches(text: string, matches: RegExpMatchArray, isURISearch: boolean, protectedRanges: ProtectedRanges): textReplacement[] {
    // make sure you do not match on the same thing more than once by keeping track of the last position you checked up to
    let startSearch = 0;
    // Every match is located and inspected against the text as it was passed in rather than against
    // a copy that grows as angle brackets are added, so that the whole text is only rebuilt once at
    // the end instead of once per url.
    const replacements: textReplacement[] = [];
    const numMatches = matches.length;
    for (let i = 0; i < numMatches; i++) {
      let urlMatch = matches[i];
      let urlStart = text.indexOf(urlMatch, startSearch);
      let urlEnd = urlStart + urlMatch.length;
      startSearch = urlEnd;
      // anchorTag protects the URL between the two HTML nodes as well as the tags themselves.
      if (protectedRanges.isProtected(urlStart, urlEnd)) {
        continue;
      }
      if (urlMatch.charAt(0) === '<') {
        urlMatch = urlMatch.substring(1);
        urlStart++;
      }

      if (urlMatch.charAt(urlMatch.length - 1) === '>') {
        urlMatch = urlMatch.substring(0, urlMatch.length - 1);
        urlEnd--;
      }

      const previousChar = urlStart === 0 ? undefined : redactProtected(text, protectedRanges, urlStart - 1, urlStart).slice(-1);
      let nextChar = urlEnd >= text.length ? undefined : redactProtected(text, protectedRanges, urlEnd, urlEnd + 1).charAt(0);
      // check for an unmatched opening paren
      const openingParentheses = countInstances(urlMatch, '(');
      if (openingParentheses != 0 && openingParentheses != countInstances(urlMatch, ')') && nextChar == ')') {
        urlMatch += nextChar;
        urlEnd++;
        nextChar = urlEnd >= text.length ? undefined : redactProtected(text, protectedRanges, urlEnd, urlEnd + 1).charAt(0);
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

        if (!protectedRanges.isProtected(startOfOpeningChevrons, endOfClosingChevrons + 1)) {
          this.addReplacement(replacements, {startIndex: startOfOpeningChevrons, endIndex: endOfClosingChevrons+1, value: '<' + urlMatch + '>'});
        }

        startSearch = urlStart + urlMatch.length;
        continue;
      }

      if (!protectedRanges.isProtected(urlStart, urlStart + urlMatch.length)) {
        this.addReplacement(replacements, {startIndex: urlStart, endIndex: urlStart + urlMatch.length, value: '<' + urlMatch + '>'});
      }
      startSearch = urlStart + urlMatch.length;
    }

    return replacements;
  }
  addReplacement(replacements: textReplacement[], replacement: textReplacement) {
    // a url wrapped in chevrons reaches back over the characters before it, which can run into the
    // url already dealt with when two of them sit right next to each other
    const previous = replacements[replacements.length - 1];
    if (previous && replacement.startIndex < previous.endIndex) {
      return;
    }

    replacements.push(replacement);
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
