import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {updateListItemText} from '../utils/mdast';

class RemoveSpaceAroundFullwidthCharactersOptions implements Options {
}

@RuleBuilder.register
export default class RemoveSpaceAroundFullwidthCharacters extends RuleBuilder<RemoveSpaceAroundFullwidthCharactersOptions> {
  get OptionsClass(): new () => RemoveSpaceAroundFullwidthCharactersOptions {
    return RemoveSpaceAroundFullwidthCharactersOptions;
  }
  get name(): string {
    return 'Remove Space around Fullwidth Characters';
  }
  get description(): string {
    return 'Ensures that fullwidth characters are not followed by whitespace (either single spaces or a tab)';
  }
  get type(): RuleType {
    return RuleType.SPACING;
  }
  apply(text: string, options: RemoveSpaceAroundFullwidthCharactersOptions): string {
    const fullwidthCharacterWithTextAtStart = /([ \t])+([\u2013\u2014\u2026\u3001\u3002\u300a\u300d-\u300f\u3014\u3015\u3008-\u3011\uff00-\uffff])/g;
    const fullwidthCharacterWithTextAtEnd = /([\u2013\u2014\u2026\u3001\u3002\u300a\u300d-\u300f\u3014\u3015\u3008-\u3011\uff00-\uffff])([ \t])+/g;

    const replaceWhitespaceAroundFullwidthCharacters = function(text: string): string {
      return text.replace(fullwidthCharacterWithTextAtStart, '$2').replace(fullwidthCharacterWithTextAtEnd, '$1');
    };

    let newText = ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag, IgnoreTypes.list], text, replaceWhitespaceAroundFullwidthCharacters);

    newText = updateListItemText(newText, replaceWhitespaceAroundFullwidthCharacters);

    return newText;
  }
  get exampleBuilders(): ExampleBuilder<RemoveSpaceAroundFullwidthCharactersOptions>[] {
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
  get optionBuilders(): OptionBuilderBase<RemoveSpaceAroundFullwidthCharactersOptions>[] {
    return [];
  }
}
