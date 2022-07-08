import dedent from 'ts-dedent';
import {rulesDict} from '../rules';

describe('Consecutive blank lines', () => {
  it('Handles ignores code blocks', () => {
    const before = dedent`
    Line 1


    \`\`\`
    


    \`\`\`
    `;
    const after = dedent`
    Line 1

    \`\`\`



    \`\`\`
    `;
    expect(rulesDict['consecutive-blank-lines'].apply(before)).toBe(after);
  });
});
