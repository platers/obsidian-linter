import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, ExampleBuilder, OptionBuilderBase, TextOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {updateListItemText} from '../utils/mdast';
import {escapeRegExp} from '../utils/regex';

class RemoveSpaceAroundCharactersOptions implements Options {
  includeFullwidthForms: boolean = true;
  includeCJKSymbolsAndPunctuation: boolean = true;
  includeDashes: boolean = true;
  otherSymbols: string = '';
}

@RuleBuilder.register
export default class RemoveSpaceAroundCharacters extends RuleBuilder<RemoveSpaceAroundCharactersOptions> {
  get OptionsClass(): new () => RemoveSpaceAroundCharactersOptions {
    return RemoveSpaceAroundCharactersOptions;
  }
  get name(): string {
    return 'Remove Space around Characters';
  }
  get description(): string {
    return 'Ensures that certain characters are not surrounded by whitespace (either single spaces or a tab). Note that this may causes issues with markdown format in some cases.';
  }
  get type(): RuleType {
    return RuleType.SPACING;
  }
  apply(text: string, options: RemoveSpaceAroundCharactersOptions): string {
    let symbolsRegExpBuilder = '';

    if (options.includeFullwidthForms) {
      symbolsRegExpBuilder += '\uff01-\uff5e';
    }

    if (options.includeCJKSymbolsAndPunctuation) {
      symbolsRegExpBuilder += '\u3000-\u30ff';
    }

    if (options.includeDashes) {
      symbolsRegExpBuilder += '\u2013\u2014';
    }

    symbolsRegExpBuilder += escapeRegExp(options.otherSymbols);

    if (!symbolsRegExpBuilder) {
      return text;
    }

    const fullwidthCharacterWithTextAtStart = new RegExp(`([ \t])+([${symbolsRegExpBuilder}])`, 'g');
    const fullwidthCharacterWithTextAtEnd = new RegExp(`([${symbolsRegExpBuilder}])([ \t])+`, 'g');

    const replaceWhitespaceAroundFullwidthCharacters = function(text: string): string {
      return text.replace(fullwidthCharacterWithTextAtStart, '$2').replace(fullwidthCharacterWithTextAtEnd, '$1');
    };

    let newText = ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag, IgnoreTypes.list], text, replaceWhitespaceAroundFullwidthCharacters);

    newText = updateListItemText(newText, replaceWhitespaceAroundFullwidthCharacters);

    return newText;
  }
  get exampleBuilders(): ExampleBuilder<RemoveSpaceAroundCharactersOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Remove Spaces and Tabs around Fullwidth Characters',
        before: dedent`
          Full list of affected characters: ０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ，．：；！？＂＇｀＾～￣＿＆＠＃％＋－＊＝＜＞（）［］｛｝｟｠｜￤／＼￢＄￡￠￦￥。、「」『』〔〕【】—…–《》〈〉
          This is a fullwidth period\t 。 with text after it.
          This is a fullwidth comma\t，  with text after it.
          This is a fullwidth left parenthesis （ \twith text after it.
          This is a fullwidth right parenthesis ）  with text after it.
          This is a fullwidth colon ：  with text after it.
          This is a fullwidth semicolon ；  with text after it.
            Ｒemoves space at start of line
        `,
        after: dedent`
          Full list of affected characters:０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ，．：；！？＂＇｀＾～￣＿＆＠＃％＋－＊＝＜＞（）［］｛｝｟｠｜￤／＼￢＄￡￠￦￥。、「」『』〔〕【】—…–《》〈〉
          This is a fullwidth period。with text after it.
          This is a fullwidth comma，with text after it.
          This is a fullwidth left parenthesis（with text after it.
          This is a fullwidth right parenthesis）with text after it.
          This is a fullwidth colon：with text after it.
          This is a fullwidth semicolon；with text after it.
          Ｒemoves space at start of line
        `,
      }),
      new ExampleBuilder({
        description: 'Fullwidth Characters in List Do not Affect List Markdown Syntax',
        before: dedent`
          # List indicators should not have the space after them removed if they are followed by a fullwidth character
          ${''}
          - ［ contents here］
            - \t［ more contents here］ more text here
          + \t［ another item here］
          * ［ one last item here］
          ${''}
          # Nested in a block quote
          ${''}
          > - ［ contents here］
          >   - \t［ more contents here］ more text here
          > + \t［ another item here］
          > * ［ one last item here］
          ${''}
          # Doubly nested in a block quote
          ${''}
          > The following is doubly nested
          > > - ［ contents here］
          > >   - \t［ more contents here］ more text here
          > > + \t［ another item here］
          > > * ［ one last item here］
        `,
        after: dedent`
          # List indicators should not have the space after them removed if they are followed by a fullwidth character
          ${''}
          - ［contents here］
            - ［more contents here］more text here
          + ［another item here］
          * ［one last item here］
          ${''}
          # Nested in a block quote
          ${''}
          > - ［contents here］
          >   - ［more contents here］more text here
          > + ［another item here］
          > * ［one last item here］
          ${''}
          # Doubly nested in a block quote
          ${''}
          > The following is doubly nested
          > > - ［contents here］
          > >   - ［more contents here］more text here
          > > + ［another item here］
          > > * ［one last item here］
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<RemoveSpaceAroundCharactersOptions>[] {
    return [
      new BooleanOptionBuilder({
        name: 'Include Fullwidth Forms',
        description: 'Include <a href="https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block)">Fullwidth Forms Unicode block</a>',
        OptionsClass: RemoveSpaceAroundCharactersOptions,
        optionsKey: 'includeFullwidthForms',
      }),
      new BooleanOptionBuilder({
        name: 'Include CJK Symbols and Punctuation',
        description: 'Include <a href="https://en.wikipedia.org/wiki/CJK_Symbols_and_Punctuation">CJK Symbols and Punctuation Unicode block</a>',
        OptionsClass: RemoveSpaceAroundCharactersOptions,
        optionsKey: 'includeCJKSymbolsAndPunctuation',
      }),
      new BooleanOptionBuilder({
        name: 'Include Dashes',
        description: 'Include en dash (–) and em dash (—)',
        OptionsClass: RemoveSpaceAroundCharactersOptions,
        optionsKey: 'includeDashes',
      }),
      new TextOptionBuilder({
        name: 'Other symbols',
        description: 'Other symbols to include',
        OptionsClass: RemoveSpaceAroundCharactersOptions,
        optionsKey: 'otherSymbols',
      }),
    ];
  }
}
