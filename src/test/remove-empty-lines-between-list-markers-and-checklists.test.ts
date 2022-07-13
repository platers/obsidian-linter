import dedent from 'ts-dedent';
import {rulesDict} from '../rules';

describe('Remove Empty Lines Between List Markers and Checklists', () => {
  // accounts for https://github.com/platers/obsidian-linter/issues/283
  it('Horizontal Rules after list should not be affected', () => {
    const before = dedent`
    Starting Text

    ---

    - Some list item 1
    - Some list item 2
    
    ---
    
    Some text

    ***

    * Some list item 1
    * Some list item 2
    
    ***

    More Text
    `;
    const after = dedent`
    Starting Text

    ---

    - Some list item 1
    - Some list item 2
    
    ---
    
    Some text

    ***

    * Some list item 1
    * Some list item 2
    
    ***

    More Text
    `;
    expect(rulesDict['remove-empty-lines-between-list-markers-and-checklists'].apply(before)).toBe(after);
  });
});
