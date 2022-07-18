import ConvertSpacesToTabs from '../rules/convert-spaces-to-tabs';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: ConvertSpacesToTabs,
  testCases: [
    {
      testName: 'Basic case',
      before: dedent`
        - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            - Vestibulum id tortor lobortis, tristique mi quis, pretium metus.
        - Nunc ut arcu fermentum enim auctor accumsan ut a risus.
                - Donec ut auctor dui.
      `,
      after: dedent`
        - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        \t- Vestibulum id tortor lobortis, tristique mi quis, pretium metus.
        - Nunc ut arcu fermentum enim auctor accumsan ut a risus.
        \t\t- Donec ut auctor dui.
      `,
    },
  ],
});
