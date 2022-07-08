import dedent from 'ts-dedent';
import {rulesDict} from '../rules';

describe('YAML Key Sort', () => {
  it('Sort with multiline array keeps values for multiline array', () => {
    const before = dedent`
        ---
        language: Typescript
        type: programming
        tags: computer
        keywords: []
        status: WIP
        date: 02/15/2022
        aliases:
          - alias1
          - alias2
          - alias3
        ---
        `;

    const after = dedent`
        ---
        aliases:
          - alias1
          - alias2
          - alias3
        date: 02/15/2022
        keywords: []
        language: Typescript
        status: WIP
        tags: computer
        type: programming
        ---
        `;

    expect(rulesDict['yaml-key-sort'].apply(before, {'YAML Key Priority Sort Order': '', 'YAML Sort Order for Other Keys': 'Ascending Alphabetical', 'Priority Keys at Start of YAML': true})).toBe(after);
  });

  it('Sort with new line in yaml removes new line', () => {
    const before = dedent`
          ---
          language: Typescript
          type: programming
          tags: computer
          keywords: []

          date: 02/15/2022
          aliases:
            - alias1
            - alias2
            - alias3
          status: WIP
          ---
          `;

    const after = dedent`
          ---
          aliases:
            - alias1
            - alias2
            - alias3
          date: 02/15/2022
          keywords: []
          language: Typescript
          status: WIP
          tags: computer
          type: programming
          ---
          `;

    expect(rulesDict['yaml-key-sort'].apply(before, {'YAML Key Priority Sort Order': '', 'YAML Sort Order for Other Keys': 'Ascending Alphabetical', 'Priority Keys at Start of YAML': true})).toBe(after);
  });
});
