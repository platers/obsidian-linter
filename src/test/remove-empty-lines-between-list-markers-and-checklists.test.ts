import RemoveEmptyLinesBetweenListMarkersAndChecklists from '../rules/remove-empty-lines-between-list-markers-and-checklists';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: RemoveEmptyLinesBetweenListMarkersAndChecklists,
  testCases: [
    {
      testName: 'Horizontal Rules after list should not be affected',
      before: dedent`
        Starting Text

        ---

        - Some list item 1
        - Some list item 2

        ---

        Some text

        ***

        * Some list item 1
        * Some list item 2

        ***

        More Text
      `,
      after: dedent`
        Starting Text

        ---

        - Some list item 1
        - Some list item 2
        
        ---
        
        Some text

        ***

        * Some list item 1
        * Some list item 2
        
        ***

        More Text
      `,
    },
  ],
});
