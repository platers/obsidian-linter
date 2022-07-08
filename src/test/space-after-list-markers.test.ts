import dedent from 'ts-dedent';
import {rulesDict} from '../rules';

describe('List spaces', () => {
  it('Handles empty bullets', () => {
    const before = dedent`
        Line
        - 1
        - 
        Line
        `;
    const after = dedent`
        Line
        - 1
        - 
        Line
        `;
    expect(rulesDict['space-after-list-markers'].apply(before)).toBe(after);
  });
});
