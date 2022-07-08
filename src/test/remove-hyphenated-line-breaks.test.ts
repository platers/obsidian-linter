import dedent from 'ts-dedent';
import {rulesDict} from '../rules';

describe('Remove Hyphenated Line Breaks', () => {
  // accounts for https://github.com/platers/obsidian-linter/issues/241
  it('Make sure text ending in a hyphen followed by a link does not trigger the hyphenated line break rule', () => {
    const before = dedent`
      # Hello world
  
      Paragraph contents are here- [link text](pathToFile/file.md)
      Paragraph contents are here- [[file]]
      `;

    const after = dedent`
      # Hello world
  
      Paragraph contents are here- [link text](pathToFile/file.md)
      Paragraph contents are here- [[file]]
      `;

    expect(rulesDict['remove-hyphenated-line-breaks'].apply(before)).toBe(after);
  });
});
