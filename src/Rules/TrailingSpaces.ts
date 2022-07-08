import {BooleanOption} from '../option';
import {Example, RuleType, Options} from '../rules';
import {ignoreCodeBlocksYAMLTagsAndLinks} from '../utils';
import {Option} from '../option';
import dedent from 'ts-dedent';
import RuleBase from './RuleBase';

export class TrailingSpacesOptions implements Options {
  twoSpaceLineBreak: boolean = false;
}

export class TrailingSpaces extends RuleBase<TrailingSpacesOptions> {
  get name(): string {
    return 'Trailing spaces';
  }

  get description(): string {
    return 'Removes extra spaces after every line.';
  }

  get type(): RuleType {
    return RuleType.SPACING;
  }

  apply(text: string, options: TrailingSpacesOptions) {
    return ignoreCodeBlocksYAMLTagsAndLinks(text, (text) => {
      if (!options.twoSpaceLineBreak) {
        return text.replace(/[ \t]+$/gm, '');
      } else {
        text = text.replace(/(\S)(?! {2}$)[ \t]+$/gm, '$1'); // exclude two trailing spaces
        return text;
      }
    });
  }

  get examples(): Example[] {
    return [
      Example.create({
        description: 'Removes trailing spaces and tabs.',
        /* eslint-disable no-tabs */
        before: dedent`
          # H1   
          Line with trailing spaces and tabs.	        
        `,
        /* eslint-enable no-tabs */
        after: dedent`
          # H1
          Line with trailing spaces and tabs.
        `,
      }),
      Example.create({
        description: 'With `Two Space Linebreak = true`',
        before: dedent`
          # H1
          Line with trailing spaces and tabs.  
        `, // eslint-disable-line no-tabs
        after: dedent`
          # H1
          Line with trailing spaces and tabs.  
        `,
        options: {
          twoSpaceLineBreak: true,
        } as TrailingSpacesOptions,
      }),
    ];
  }

  get options(): Option[] {
    return [
      BooleanOption.create({
        optionsClass: TrailingSpacesOptions,
        name: 'Two Space Linebreak',
        description: 'Ignore two spaces followed by a line break ("Two Space Rule").',
        optionsKey: 'twoSpaceLineBreak',
      }),
    ];
  }
}
