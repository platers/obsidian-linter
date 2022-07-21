import dedent from 'ts-dedent';
import {rulesDict} from '../rules';

describe('Remove Link Spacing', () => {
  // accounts for https://github.com/platers/obsidian-linter/issues/236
  it('Link after checkbox is not affected by removing whitespace in links', () => {
    const before = dedent`
      - [ ] [Link text](path/fileName.md)
      - [ ] [[fileName]]
      `;

    const after = dedent`
      - [ ] [Link text](path/fileName.md)
      - [ ] [[fileName]]
      `;

    expect(rulesDict['remove-link-spacing'].apply(before)).toBe(after);
  });
});
