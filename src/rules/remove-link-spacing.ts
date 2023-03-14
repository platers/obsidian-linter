import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {removeSpacesInLinkText} from '../utils/mdast';
import {removeSpacesInWikiLinkText} from '../utils/regex';

class RemoveLinkSpacingOptions implements Options {}

@RuleBuilder.register
export default class RemoveLinkSpacing extends RuleBuilder<RemoveLinkSpacingOptions> {
  constructor() {
    super({
      nameKey: 'rules.remove-link-spacing.name',
      descriptionKey: 'rules.remove-link-spacing.description',
      type: RuleType.SPACING,
    });
  }
  get OptionsClass(): new () => RemoveLinkSpacingOptions {
    return RemoveLinkSpacingOptions;
  }
  apply(text: string, options: RemoveLinkSpacingOptions): string {
    text = removeSpacesInLinkText(text);
    return removeSpacesInWikiLinkText(text);
  }
  get exampleBuilders(): ExampleBuilder<RemoveLinkSpacingOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Space in regular markdown link text',
        before: dedent`
          [ here is link text1 ](link_here)
          [ here is link text2](link_here)
          [here is link text3 ](link_here)
          [here is link text4](link_here)
          [\there is link text5\t](link_here)
          [](link_here)
          **Note that image markdown syntax does not get affected even if it is transclusion:**
          ![\there is link text6 ](link_here)
        `,
        after: dedent`
          [here is link text1](link_here)
          [here is link text2](link_here)
          [here is link text3](link_here)
          [here is link text4](link_here)
          [here is link text5](link_here)
          [](link_here)
          **Note that image markdown syntax does not get affected even if it is transclusion:**
          ![\there is link text6 ](link_here)
        `,
      }),
      new ExampleBuilder({
        description: 'Space in wiki link text',
        before: dedent`
          [[link_here| here is link text1 ]]
          [[link_here|here is link text2 ]]
          [[link_here| here is link text3]]
          [[link_here|here is link text4]]
          [[link_here|\there is link text5\t]]
          ![[link_here|\there is link text6\t]]
          [[link_here]]
        `,
        after: dedent`
          [[link_here|here is link text1]]
          [[link_here|here is link text2]]
          [[link_here|here is link text3]]
          [[link_here|here is link text4]]
          [[link_here|here is link text5]]
          ![[link_here|here is link text6]]
          [[link_here]]
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<RemoveLinkSpacingOptions>[] {
    return [];
  }
}
