import HeaderIncrement from '../src/rules/header-increment';
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
    { // accounts for https://github.com/platers/obsidian-linter/issues/412
      testName: 'When H1 starts file, header increment should act like normal',
      before: dedent`
        # H1
        ### H3
        #### H4
        # H1
        #### H4
        ###### H6

        H1 at beginning of file: same as existing behavior
      `,
      after: dedent`
        # H1
        ## H3
        ### H4
        # H1
        ## H4
        ### H6

        H1 at beginning of file: same as existing behavior
      `,
      options: {
        startAtH2: true,
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/412
      testName: 'When H1 does not start the file, H1s are left alone and minimum header is H2 for decremented headers',
      before: dedent`
        ### H3
        #### H4
        # H1
        ##### H5
        ###### H6

        No H1 at beginning of file: No header promoted beyond H2; H1s left alone
      `,
      after: dedent`
        ## H3
        ### H4
        # H1
        ## H5
        ### H6

        No H1 at beginning of file: No header promoted beyond H2; H1s left alone
      `,
      options: {
        startAtH2: true,
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/412
      testName: 'When H1 does not exist in the file, the minimum header is an H2 and incrementing starts from that level',
      before: dedent`
        ### H3
        #### H4
        ## H2
        #### H4
        ###### H6

        Nothing gets promoted above H2
      `,
      after: dedent`
        ## H3
        ### H4
        ## H2
        ### H4
        #### H6

        Nothing gets promoted above H2
      `,
      options: {
        startAtH2: true,
      },
    },
  ],
});
