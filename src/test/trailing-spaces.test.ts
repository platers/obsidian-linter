import dedent from 'ts-dedent';
import {rulesDict} from '../rules-list';

describe('Trailing spaces', () => {
  it('One trailing space removed', () => {
    const before = dedent`
          # H1 
          line with one trailing spaces 
        `;
    const after = dedent`
          # H1
          line with one trailing spaces
        `;
    expect(rulesDict['trailing-spaces'].apply(before)).toBe(after);
  });
  it('Three trailing whitespaces removed', () => {
    const before = dedent`
          # H1   
          line with three trailing spaces   
        `;
    const after = dedent`
          # H1
          line with three trailing spaces
        `;
    expect(rulesDict['trailing-spaces'].apply(before)).toBe(after);
  });
  /* eslint-disable no-mixed-spaces-and-tabs, no-tabs */
  it('Tab-Space-Linebreak removed', () => {
    const before = dedent`
        # H1
        line with trailing tab and spaces    

    `;
    const after = dedent`
        # H1
        line with trailing tab and spaces
        
    `;
    expect(rulesDict['trailing-spaces'].apply(before, {'Two Space Linebreak': true})).toBe(after);
  });
  /* eslint-enable no-mixed-spaces-and-tabs, no-tabs */
  it('Two Space Linebreak not removed', () => {
    const before = dedent`
          # H1
          line with one trailing spaces  
  
        `;
    const after = dedent`
          # H1
          line with one trailing spaces  
  
        `;
    expect(rulesDict['trailing-spaces'].apply(before, {'Two Space Linebreak': true})).toBe(after);
  });
  it('Regular link with spaces stays the same', () => {
    const before = dedent`
        # Hello world
    
        [This has  spaces in it](File with  spaces.md)
        `;

    const after = dedent`
        # Hello world
    
        [This has  spaces in it](File with  spaces.md)
        `;

    expect(rulesDict['trailing-spaces'].apply(before)).toBe(after);
  });
  it('Image link with spaces stays the same', () => {
    const before = dedent`
        # Hello world
    
        ![This has  spaces in it](File with  spaces.png)
        `;

    const after = dedent`
        # Hello world
    
        ![This has  spaces in it](File with  spaces.png)
        `;

    expect(rulesDict['trailing-spaces'].apply(before)).toBe(after);
  });
  it('Wiki link with spaces stays the same', () => {
    const before = dedent`
        # Hello world
    
        [[File with  spaces]]
        `;

    const after = dedent`
        # Hello world
    
        [[File with  spaces]]
        `;

    expect(rulesDict['trailing-spaces'].apply(before)).toBe(after);
  });
});
