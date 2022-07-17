import dedent from 'ts-dedent';
import {rulesDict} from '../rules-list';

describe('Header Increment', () => {
  it('Handles large increments', () => {
    const before = dedent`
        # H1
        #### H4
        ####### H7
        `;
    const after = dedent`
        # H1
        ## H4
        ### H7
        `;
    expect(rulesDict['header-increment'].apply(before)).toBe(after);
  });
  it('Handles change from decrement to regular increment', () => {
    const before = dedent`
        # H1
        ##### H5
        ####### H7
        ###### H6
        ## H2
        `;
    const after = dedent`
        # H1
        ## H5
        ### H7
        ## H6
        ## H2
        `;
    expect(rulesDict['header-increment'].apply(before)).toBe(after);
  });
  it('Handles a variety of changes in header size', () => {
    const before = dedent`
        # H1
        ### H3
        #### H4
        ###### H6
        ## H2
        # H1
        ## H2
        ### H3
        #### H4
        ###### H6
        ##### H5
        ### H3
        `;
    const after = dedent`
        # H1
        ## H3
        ### H4
        #### H6
        ## H2
        # H1
        ## H2
        ### H3
        #### H4
        ##### H6
        ##### H5
        ### H3
        `;
    expect(rulesDict['header-increment'].apply(before)).toBe(after);
  });
});
