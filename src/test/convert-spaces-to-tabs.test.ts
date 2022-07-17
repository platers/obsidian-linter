import dedent from 'ts-dedent';
import {rulesDict} from '../rules-list';

describe('Convert spaces to tabs', () => {
  it('Basic case', () => {
    const before = dedent`
      - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          - Vestibulum id tortor lobortis, tristique mi quis, pretium metus.
      - Nunc ut arcu fermentum enim auctor accumsan ut a risus.
              - Donec ut auctor dui.
      `;
    const after = dedent`
      - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      \t- Vestibulum id tortor lobortis, tristique mi quis, pretium metus.
      - Nunc ut arcu fermentum enim auctor accumsan ut a risus.
      \t\t- Donec ut auctor dui.
      `;
    expect(rulesDict['convert-spaces-to-tabs'].apply(before, {Tabsize: '4'})).toBe(after);
  });
});
