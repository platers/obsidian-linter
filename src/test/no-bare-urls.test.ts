import dedent from 'ts-dedent';
import {rulesDict} from '../rules-list';

describe('Move Footnotes to the bottom', () => {
  // accounts for https://github.com/platers/obsidian-linter/issues/275
  it('Leaves markdown links and images alone', () => {
    const before = dedent`
    [regular link](https://google.com)
    ![image alt text](https://github.com/favicon.ico)
    `;
    const after = dedent`
    [regular link](https://google.com)
    ![image alt text](https://github.com/favicon.ico)
    `;
    expect(rulesDict['no-bare-urls'].apply(before)).toBe(after);
  });
});
