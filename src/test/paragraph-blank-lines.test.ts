import dedent from 'ts-dedent';
import {rulesDict} from '../rules';

describe('Paragraph blank lines', () => {
  it('Ignores codeblocks', () => {
    const before = dedent`
    ---
    front matter
    front matter
    ---

    Hello
    World
    \`\`\`python
    # comment not header
    a = b
    c = d
    \`\`\`
    `;
    const after = dedent`
    ---
    front matter
    front matter
    ---

    Hello

    World

    \`\`\`python
    # comment not header
    a = b
    c = d
    \`\`\`
    `;
    expect(rulesDict['paragraph-blank-lines'].apply(before)).toBe(after);
  });
  it('Handles lists', () => {
    const before = dedent`
    Hello
    World
    - 1
    \t- 2
        - 3
    `;
    const after = dedent`
    Hello

    World

    - 1
    \t- 2
        - 3
    `;
    expect(rulesDict['paragraph-blank-lines'].apply(before)).toBe(after);
  });
  // accounts for https://github.com/platers/obsidian-linter/issues/250
  it('Paragraphs that start with numbers are spaced out', () => {
    const before = dedent`
    # Hello world


    123 foo
    123 bar
    `;

    const after = dedent`
    # Hello world

    123 foo

    123 bar
    `;

    expect(rulesDict['paragraph-blank-lines'].apply(before)).toBe(after);
  });
  // accounts for https://github.com/platers/obsidian-linter/issues/250
  it('Paragraphs that start with foreign characters are spaced out', () => {
    const before = dedent`
    # Hello world


    测试 foo
    测试 bar
    `;

    const after = dedent`
    # Hello world

    测试 foo

    测试 bar
    `;

    expect(rulesDict['paragraph-blank-lines'].apply(before)).toBe(after);
  });
  // accounts for https://github.com/platers/obsidian-linter/issues/250
  it('Paragraphs that start with whitespace characters are spaced out', () => {
    const before = dedent`
    # Hello world

    foo
    bar
    `;

    const after = dedent`
    # Hello world

    foo

    bar
    `;

    expect(rulesDict['paragraph-blank-lines'].apply(before)).toBe(after);
  });
  it('Make sure blockquotes are not affected', () => {
    const before = dedent`
      # Hello world
  
      > blockquote
      > blockquote line 2
      `;

    const after = dedent`
      # Hello world
  
      > blockquote
      > blockquote line 2
      `;

    expect(rulesDict['paragraph-blank-lines'].apply(before)).toBe(after);
  });
  it('Make sure lists are not affected', () => {
    const before = dedent`
      # Hello world
  
      > blockquote
      > blockquote line 2
      `;

    const after = dedent`
      # Hello world
  
      > blockquote
      > blockquote line 2
      `;

    expect(rulesDict['paragraph-blank-lines'].apply(before)).toBe(after);
  });
  it('Make sure lines ending in a line break are not affected', () => {
    const before = dedent`
    # Hello world


    paragraph line 1 <br>
    paragraph line 2  
    paragraph line 3 <br/>
    paragraph final line


    `;

    const after = dedent`
    # Hello world

    paragraph line 1 <br>
    paragraph line 2  
    paragraph line 3 <br/>
    paragraph final line
    `;

    expect(rulesDict['paragraph-blank-lines'].apply(before)).toBe(after);
  });
});
