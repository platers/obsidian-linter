import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';

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
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
      return text.replace(/([ \t])+([\u2013\u2014\u2026\u3001\u3002\u300a\u300d-\u300f\u3014\u3015\u3008-\u3011\uff00-\uffff])/g, '$2').replace(/([\u2013\u2014\u2026\u3001\u3002\u300a\u300d-\u300f\u3014\u3015\u3008-\u3011\uff00-\uffff])([ \t])+/g, '$1');
    });
  }
  get exampleBuilders(): ExampleBuilder<RemoveSpaceAroundFullwidthCharactersOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Remove Spaces and Tabs around Fullwidth Characrters',
        before: dedent`
          Full list of affected charaters: ０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ，．：；！？＂＇｀＾～￣＿＆＠＃％＋－＊＝＜＞（）［］｛｝｟｠｜￤／＼￢＄￡￠￦￥。、「」『』〔〕【】—…–《》〈〉
          This is a fullwidth period\t 。 with text after it.
          This is a fullwidth comma\t，  with text after it.
          This is a fullwidth left parenthesis （ \twith text after it.
          This is a fullwidth right parenthesis ）  with text after it.
          This is a fullwidth colon ：  with text after it.
          This is a fullwidth semicolon ；  with text after it.
            Ｒemoves space at start of line
        `,
        after: dedent`
          Full list of affected charaters:０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ，．：；！？＂＇｀＾～￣＿＆＠＃％＋－＊＝＜＞（）［］｛｝｟｠｜￤／＼￢＄￡￠￦￥。、「」『』〔〕【】—…–《》〈〉
          This is a fullwidth period。with text after it.
          This is a fullwidth comma，with text after it.
          This is a fullwidth left parenthesis（with text after it.
          This is a fullwidth right parenthesis）with text after it.
          This is a fullwidth colon：with text after it.
          This is a fullwidth semicolon；with text after it.
          Ｒemoves space at start of line
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<RemoveSpaceAroundFullwidthCharactersOptions>[] {
    return [];
  }
}
