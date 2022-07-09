import dedent from 'ts-dedent';
import {rulesDict} from '../rules';

describe('Paragraph blank lines', () => {
  it('Make sure obsidian multiline comments are not affected', () => {
    const before = dedent`
    Here is some inline comments: %%You can't see this text%% (Can't see it)

    Here is a block comment:
    %%
    It can span
    multiple lines
    %%
    `;

    const after = dedent`
    Here is some inline comments: %%You can't see this text%% (Can't see it)

    Here is a block comment:  
    %%
    It can span
    multiple lines
    %%
    `;

    expect(rulesDict['two-spaces-between-lines-with-content'].apply(before)).toBe(after);
  });
});
