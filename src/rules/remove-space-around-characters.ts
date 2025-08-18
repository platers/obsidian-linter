import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, ExampleBuilder, OptionBuilderBase, TextOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {updateHeaderText, updateListItemText} from '../utils/mdast';
import {escapeRegExp} from '../utils/regex';

class RemoveSpaceAroundCharactersOptions implements Options {
  includeFullwidthForms?: boolean = true;
  includeCJKSymbolsAndPunctuation?: boolean = true;
  includeDashes?: boolean = true;
  otherSymbols?: string = '';
}

@RuleBuilder.register
export default class RemoveSpaceAroundCharacters extends RuleBuilder<RemoveSpaceAroundCharactersOptions> {
  constructor() {
    super({
      nameKey: 'rules.remove-space-around-characters.name',
      descriptionKey: 'rules.remove-space-around-characters.description',
      type: RuleType.SPACING,
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.inlineCode, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag],
    });
  }
  get OptionsClass(): new () => RemoveSpaceAroundCharactersOptions {
    return RemoveSpaceAroundCharactersOptions;
  }
  apply(text: string, options: RemoveSpaceAroundCharactersOptions): string {
    let symbolsRegExpBuilder = '';

    if (options.includeFullwidthForms) {
      symbolsRegExpBuilder += '\uff01-\uff5e';
    }

    if (options.includeCJKSymbolsAndPunctuation) {
      symbolsRegExpBuilder += '\u3000-\u303f';
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

    let newText = ignoreListOfTypes([IgnoreTypes.list, IgnoreTypes.heading], text, replaceWhitespaceAroundFullwidthCharacters);

    newText = updateListItemText(newText, replaceWhitespaceAroundFullwidthCharacters);
    newText = updateHeaderText(newText, replaceWhitespaceAroundFullwidthCharacters);

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
            -  ［ more contents here］ more text here
          +   ［ another item here］
          * ［ one last item here］
          ${''}
          # Nested in a blockquote
          ${''}
          > - ［ contents here］
          >   -  ［ more contents here］ more text here
          > +  ［ another item here］
          > * ［ one last item here］
          ${''}
          # Doubly nested in a blockquote
          ${''}
          > The following is doubly nested
          > > - ［ contents here］
          > >   -   ［ more contents here］ more text here
          > > +  ［ another item here］
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
          # Nested in a blockquote
          ${''}
          > - ［contents here］
          >   - ［more contents here］more text here
          > + ［another item here］
          > * ［one last item here］
          ${''}
          # Doubly nested in a blockquote
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
        nameKey: 'rules.remove-space-around-characters.include-fullwidth-forms.name',
        descriptionKey: 'rules.remove-space-around-characters.include-fullwidth-forms.description',
        OptionsClass: RemoveSpaceAroundCharactersOptions,
        optionsKey: 'includeFullwidthForms',
      }),
      new BooleanOptionBuilder({
        nameKey: 'rules.remove-space-around-characters.include-cjk-symbols-and-punctuation.name',
        descriptionKey: 'rules.remove-space-around-characters.include-cjk-symbols-and-punctuation.description',
        OptionsClass: RemoveSpaceAroundCharactersOptions,
        optionsKey: 'includeCJKSymbolsAndPunctuation',
      }),
      new BooleanOptionBuilder({
        nameKey: 'rules.remove-space-around-characters.include-dashes.name',
        descriptionKey: 'rules.remove-space-around-characters.include-dashes.description',
        OptionsClass: RemoveSpaceAroundCharactersOptions,
        optionsKey: 'includeDashes',
      }),
      new TextOptionBuilder({
        nameKey: 'rules.remove-space-around-characters.other-symbols.name',
        descriptionKey: 'rules.remove-space-around-characters.other-symbols.description',
        OptionsClass: RemoveSpaceAroundCharactersOptions,
        optionsKey: 'otherSymbols',
      }),
    ];
  }
}
