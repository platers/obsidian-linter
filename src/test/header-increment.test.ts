import HeaderIncrement from '../rules/header-increment';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: HeaderIncrement,
  testCases: [
    {
      testName: 'Handles large increments',
      before: dedent`
        # H1
        #### H4
        ####### H7
      `,
      after: dedent`
        # H1
        ## H4
        ### H7
      `,
    },
    {
      testName: 'Handles change from decrement to regular increment',
      before: dedent`
        # H1
        ##### H5
        ####### H7
        ###### H6
        ## H2
      `,
      after: dedent`
        # H1
        ## H5
        ### H7
        ## H6
        ## H2
      `,
    },
    {
      testName: 'Handles a variety of changes in header size',
      before: dedent`
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
      `,
      after: dedent`
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
      `,
    },
  ],
});
