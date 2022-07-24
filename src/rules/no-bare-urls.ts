import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {replaceTextBetweenStartAndEndWithNewValue} from '../utils/strings';

class NoBareUrlsOptions implements Options {
}

@RuleBuilder.register
export default class NoBareUrls extends RuleBuilder<NoBareUrlsOptions> {
  get OptionsClass(): new () => NoBareUrlsOptions {
    return NoBareUrlsOptions;
  }
  get name(): string {
    return 'No Bare URLs';
  }
  get description(): string {
    return 'Encloses bare URLs with angle brackets except when enclosed in back ticks, square braces, or single or double quotes.';
  }
  get type(): RuleType {
    return RuleType.CONTENT;
  }
  apply(text: string, options: NoBareUrlsOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag, IgnoreTypes.image], text, (text) => {
      const URLMatches = text.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s`\]'">]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s`\]'">]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s`\]'">]{2,}|www\.[a-zA-Z0-9]+\.[^\s`\]'">]{2,})/gi);

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
        if (previousChar != undefined && (previousChar === '`' || previousChar === '"' || previousChar === '\'' || previousChar === '[' || previousChar === '<') &&
          nextChar != undefined && (nextChar === '`' || nextChar === '"' || nextChar === '\'' || nextChar === ']' || nextChar === '>')) {
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
        description: 'Angle brackets are added if the url is not the only text in the single quotes(\'), double quotes("), or backticks(`)',
        before: dedent`
          [https://github.com some text here]
          backticks around a url should stay the same, but only if the only contents of the backticks: \`https://github.com some text here\`
          single quotes around a url should stay the same, but only if the contents of the single quotes is the url: 'https://github.com some text here'
          double quotes around a url should stay the same, but only if the contents of the double quotes is the url: "https://github.com some text here"
        `,
        after: dedent`
          [<https://github.com> some text here]
          backticks around a url should stay the same, but only if the only contents of the backticks: \`<https://github.com> some text here\`
          single quotes around a url should stay the same, but only if the contents of the single quotes is the url: '<https://github.com> some text here'
          double quotes around a url should stay the same, but only if the contents of the double quotes is the url: "<https://github.com> some text here"
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<NoBareUrlsOptions>[] {
    return [];
  }
}
