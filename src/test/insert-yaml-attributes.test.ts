import dedent from 'ts-dedent';
import {rulesDict} from '../rules';

describe('Insert yaml attributes', () => {
  it('Inits yaml if it does not exist', () => {
    const before = dedent`
      `;
    const after = dedent`
      ---
      tags:
      ---
      
      `;
    expect(rulesDict['insert-yaml-attributes'].apply(before, {'Text to insert': 'tags:'})).toBe(after);
  });
  // accounts for https://github.com/platers/obsidian-linter/issues/176
  it('Inits yaml when the file has --- in it and no frontmatter', () => {
    const before = dedent`
    # Heading
    Text

    # Heading
    - Text
    - Text
    ---

    `;
    const after = dedent`
    ---
    tags:
    ---
    # Heading
    Text

    # Heading
    - Text
    - Text
    ---

    `;
    expect(rulesDict['insert-yaml-attributes'].apply(before, {'Text to insert': 'tags:'})).toBe(after);
  });
  // accounts for https://github.com/platers/obsidian-linter/issues/157
  it('When a file has tabs at the start of a line in the frontmatter, the yaml insertion still works leaving other tabs as they were', () => {
    const before = dedent`
      ---
      title: this title\thas a tab
      tags:
      \t- test1
      \t- test2
      ---
      `;
    const after = dedent`
      ---
      blob:
      title: this title\thas a tab
      tags:
      \t- test1
      \t- test2
      ---
      `;
    expect(rulesDict['insert-yaml-attributes'].apply(before, {'Text to insert': 'blob:'})).toBe(after);
  });
});
