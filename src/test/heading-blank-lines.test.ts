import dedent from 'ts-dedent';
import {rulesDict} from '../rules';

describe('Heading blank lines', () => {
  it('Ignores codeblocks', () => {
    const before = dedent`
        ---
        front matter
        ---
        
        # H1
        \`\`\`
        # comment not header
        $$
        a = b
        $$
        \`\`\``;
    const after = dedent`
        ---
        front matter
        ---

        # H1

        \`\`\`
        # comment not header
        $$
        a = b
        $$
        \`\`\``;
    expect(rulesDict['heading-blank-lines'].apply(before)).toBe(after);
  });
  it('Ignores # not in headings', () => {
    const before = dedent`
        Not a header # .
        Line
        \`\`\`
        # comment not header
        a = b
        \`\`\`
        ~~~
        # comment not header
        ~~~
          # tabbed not header
            # space not header
        `;
    const after = dedent`
        Not a header # .
        Line
        \`\`\`
        # comment not header
        a = b
        \`\`\`
        ~~~
        # comment not header
        ~~~
          # tabbed not header
            # space not header
        `;
    expect(rulesDict['heading-blank-lines'].apply(before)).toBe(after);
  });
  it('Works normally', () => {
    const before = dedent`
        # H1
        ## H2
        Line
        ### H3
        `;
    const after = dedent`
        # H1

        ## H2

        Line
        
        ### H3
        `;
    expect(rulesDict['heading-blank-lines'].apply(before)).toBe(after);
  });
});
