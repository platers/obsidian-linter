import dedent from 'ts-dedent';
import rulesList from '../rules-list';

describe('File Name Heading', () => {
  it('Handles stray dashes', () => {
    const before = dedent`
      Text 1

      ---
      
      Text 2
        `;
    const after = dedent`
      # File Name
      Text 1
      
      ---
      
      Text 2
        `;
    expect(rulesList.rulesDict['file-name-heading'].apply(before, {'metadata: file name': 'File Name'})).toBe(after);
  });
});
