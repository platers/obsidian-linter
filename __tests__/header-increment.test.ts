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
      testName: 'H1s become H2s and all other headers are shifted accordingly when an H1 starts a file',
      before: dedent`
        # H1
        ### H3
        #### H4
        # H1
        #### H4
        ###### H6
      `,
      after: dedent`
        ## H1
        ### H3
        #### H4
        ## H1
        ### H4
        #### H6
      `,
      options: {
        startAtH2: true,
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/412
      testName: 'When H1 does not start the file, H1s are converted to H2 where they are and the next header is an H3',
      before: dedent`
        ### H3
        #### H4
        # H1
        ##### H5
        ###### H6
      `,
      after: dedent`
        ## H3
        ### H4
        ## H1
        ### H5
        #### H6
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
