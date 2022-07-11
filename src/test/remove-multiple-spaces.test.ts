import dedent from 'ts-dedent';
import {rulesDict} from '../rules';

describe('Remove Multiple Spaces', () => {
  it('Make sure spaces at the end of the line are ignored', () => {
    const before = dedent`
      # Hello world
  
      Paragraph contents are here  
      Second paragraph contents here  
      `;

    const after = dedent`
      # Hello world
  
      Paragraph contents are here  
      Second paragraph contents here  
      `;

    expect(rulesDict['remove-multiple-spaces'].apply(before)).toBe(after);
  });
  it('Make sure spaces at the start of the line are ignored', () => {
    const before = '  Paragraph contents are here\n  Second paragraph here...';

    const after = '  Paragraph contents are here\n  Second paragraph here...';

    expect(rulesDict['remove-multiple-spaces'].apply(before)).toBe(after);
  });
  it('Make sure non-letter followed or preceeded by 2 spaces has them cut down to 1 space', () => {
    const before = dedent`
    # Hello world

    Paragraph contents  (something). Something else  .
    `;

    const after = dedent`
    # Hello world

    Paragraph contents (something). Something else .
    `;

    expect(rulesDict['remove-multiple-spaces'].apply(before)).toBe(after);
  });
  it('Links followed by parentheses do not prevent other removal of multiple spaces in a row', () => {
    const before = dedent`
      [Link text](path/fileName.md) (2 spaces in between  text)
      `;

    const after = dedent`
      [Link text](path/fileName.md) (2 spaces in between text)
      `;

    expect(rulesDict['remove-multiple-spaces'].apply(before)).toBe(after);
  });
  it('Tables are ignored', () => {
    const before = dedent`
    # Table 1
      
    | Column 1 | Column 2 | Column 3 |
    |----------|----------|----------|
    | foo      | bar      | blob     |
    | baz      | qux      | trust    |
    | quux     | quuz     | glob     |
    
    # Table 2

    | Column 1 | Column 2 |
    |----------|----------|
    | foo      | bar      |
    | baz      | qux      |
    | quux     | quuz     |
    
    New paragraph.
      `;

    const after = dedent`
      # Table 1
        
      | Column 1 | Column 2 | Column 3 |
      |----------|----------|----------|
      | foo      | bar      | blob     |
      | baz      | qux      | trust    |
      | quux     | quuz     | glob     |
      
      # Table 2

      | Column 1 | Column 2 |
      |----------|----------|
      | foo      | bar      |
      | baz      | qux      |
      | quux     | quuz     |
      
      New paragraph.
      `;

    expect(rulesDict['remove-multiple-spaces'].apply(before)).toBe(after);
  });
});
