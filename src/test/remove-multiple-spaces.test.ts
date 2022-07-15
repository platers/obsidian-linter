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
  // accounts for https://github.com/platers/obsidian-linter/issues/244
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
  // accounts for https://github.com/platers/obsidian-linter/issues/289
  it('Callouts and block quotes allow multiple spaces at start to allow for code and list item indentation', () => {
    const before = dedent`
      # List Item in Callout
        
      > [!info] Unordered List
      > - First Level
      > - First Level
      >   - Second Level
      >     - Third Level
      > - First Level

      # Code in Callout

      > [!info] Code
      >     Line 1
      >     Line 2
      >     Line 3

      # List Item in Block Quote
        
      > Unordered List
      > - First Level
      > - First Level
      >   - Second Level
      >     - Third Level
      > - First Level

      # Code in Block Quote
      
      > Code
      >     Line 1
      >     Line 2
      >     Line 3
    `;

    const after = dedent`
      # List Item in Callout
        
      > [!info] Unordered List
      > - First Level
      > - First Level
      >   - Second Level
      >     - Third Level
      > - First Level

      # Code in Callout

      > [!info] Code
      >     Line 1
      >     Line 2
      >     Line 3

      # List Item in Block Quote
        
      > Unordered List
      > - First Level
      > - First Level
      >   - Second Level
      >     - Third Level
      > - First Level

      # Code in Block Quote
      
      > Code
      >     Line 1
      >     Line 2
      >     Line 3
    `;

    expect(rulesDict['remove-multiple-spaces'].apply(before)).toBe(after);
  });
  it('Multiple spaces after ">" are still removed if not the start of a line', () => {
    const before = dedent`
    # Text with > with multiple spaces after it
      
    Text >  other text
    `;

    const after = dedent`
    # Text with > with multiple spaces after it
      
    Text > other text
    `;

    expect(rulesDict['remove-multiple-spaces'].apply(before)).toBe(after);
  });
});
