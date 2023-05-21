import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase, TextOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {updateListItemText} from '../utils/mdast';
import {escapeRegExp} from '../utils/regex';

class RemoveSpaceBeforeOrAfterCharactersOptions implements Options {
  charactersToRemoveSpacesBefore: string = ',!?;:).’”]';
  charactersToRemoveSpacesAfter: string = '¿¡‘“([';
}

@RuleBuilder.register
export default class RemoveSpaceBeforeOrAfterCharacters extends RuleBuilder<RemoveSpaceBeforeOrAfterCharactersOptions> {
  constructor() {
    super({
      nameKey: 'rules.remove-space-before-or-after-characters.name',
      descriptionKey: 'rules.remove-space-before-or-after-characters.description',
      type: RuleType.SPACING,
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag],
    });
  }
  get OptionsClass(): new () => RemoveSpaceBeforeOrAfterCharactersOptions {
    return RemoveSpaceBeforeOrAfterCharactersOptions;
  }
  apply(text: string, options: RemoveSpaceBeforeOrAfterCharactersOptions): string {
    const symbolsBefore = escapeRegExp(options.charactersToRemoveSpacesBefore);
    const symbolsAfter = escapeRegExp(options.charactersToRemoveSpacesAfter);


    if (!symbolsBefore && !symbolsAfter) {
      return text;
    }

    const removeWhitespaceBeforeCharacters = new RegExp(`([ \t])+([${symbolsBefore}])`, 'g');
    const removeWhitespaceAfterCharacters = new RegExp(`([${symbolsAfter}])([ \t])+`, 'g');
    // console.log('before: "' + removeWhitespaceBeforeCharacters.source + '"');
    // console.log('after: "' + removeWhitespaceAfterCharacters.source + '"');
    const replaceWhitespaceBeforeOrAfterCharacters = function(text: string): string {
      // console.log(text);
      return text.replace(removeWhitespaceBeforeCharacters, '$2').replace(removeWhitespaceAfterCharacters, '$1');
    };

    let newText = ignoreListOfTypes([IgnoreTypes.list, IgnoreTypes.html], text, replaceWhitespaceBeforeOrAfterCharacters);

    newText = updateListItemText(newText, replaceWhitespaceBeforeOrAfterCharacters);

    return newText;
  }
  get exampleBuilders(): ExampleBuilder<RemoveSpaceBeforeOrAfterCharactersOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Remove Spaces and Tabs Before and After Default Symbol Set',
        before: dedent`
          In the end , the space gets removed\t .
          The space before the question mark was removed right ?
          The space before the exclamation point gets removed !
          A semicolon ; and colon : have spaces removed before them
          ‘ Text in single quotes ’
          “ Text in double quotes ”
          [ Text in square braces ]
          ( Text in parenthesis )
        `,
        after: dedent`
          In the end, the space gets removed.
          The space before the question mark was removed right?
          The space before the exclamation point gets removed!
          A semicolon; and colon: have spaces removed before them
          ‘Text in single quotes’
          “Text in double quotes”
          [Text in square braces]
          (Text in parenthesis)
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<RemoveSpaceBeforeOrAfterCharactersOptions>[] {
    return [
      new TextOptionBuilder({
        nameKey: 'rules.remove-space-before-or-after-characters.characters-to-remove-space-before.name',
        descriptionKey: 'rules.remove-space-before-or-after-characters.characters-to-remove-space-before.description',
        OptionsClass: RemoveSpaceBeforeOrAfterCharactersOptions,
        optionsKey: 'charactersToRemoveSpacesBefore',
      }),
      new TextOptionBuilder({
        nameKey: 'rules.remove-space-before-or-after-characters.characters-to-remove-space-after.name',
        descriptionKey: 'rules.remove-space-before-or-after-characters.characters-to-remove-space-after.description',
        OptionsClass: RemoveSpaceBeforeOrAfterCharactersOptions,
        optionsKey: 'charactersToRemoveSpacesAfter',
      }),
    ];
  }
}
