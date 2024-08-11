import {parseCustomReplacements} from '../src/utils/strings';
import dedent from 'ts-dedent';

type parseCustomReplacementsTestCase = {
  name: string,
  text: string,
  expectedCustomReplacements: Map<string, string>
};

const getTablesInTextTestCases: parseCustomReplacementsTestCase[] = [
  {
    name: 'parsing a file with a single table with two columns gets the correct amount of parsed out entries',
    text: dedent`
      Here is some text
      | column1 | column2 |
      | ------- | ------- |
      | replaceme   | withme   |
      |     replace | with |
    `,
    expectedCustomReplacements: new Map<string, string>([['replaceme', 'withme'], ['replace', 'with']]),
  },
  {
    name: 'parsing a file with a single table with three columns gets no entries parsed out',
    text: dedent`
      Here is some text
      | column1 | column2 | column3 |
      | ------- | ------- | ---- |
      | replaceme   | withme   | me |
      |     replace | with | me2 |
    `,
    expectedCustomReplacements: new Map<string, string>(),
  },
  {
    name: 'parsing a file with two tables with two columns gets the correct amount of parsed out entries',
    text: dedent`
      Here is some text
      | column1 | column2 |
      | ------- | ------- |
      | replaceme   | withme   |
      |     replace | with |
      The following table also has some replacements
      | header1 | header2 |
      | ------- | ------- |
      | var   | variablE   |
      |     hack | hacker |
    `,
    expectedCustomReplacements: new Map<string, string>([['replaceme', 'withme'], ['replace', 'with'], ['var', 'variablE'], ['hack', 'hacker']]),
  },
  {
    name: 'parsing a file with no tables gets no parsed out entries',
    text: dedent`
      Here is some text without any tables in it.
    `,
    expectedCustomReplacements: new Map<string, string>(),
  },
  {
    name: 'parsing a file with a single table with two columns gets no entries parsed out when each line is missing a pipe (i.e. |)',
    text: dedent`
      Here is some text
      | column1 | column2 |
      | ------- | ------- |
      | replaceme   | withme   
           replace | with |
    `,
    expectedCustomReplacements: new Map<string, string>(),
  },
];

describe('Get All Tables in Text', () => {
  for (const testCase of getTablesInTextTestCases) {
    it(testCase.name, () => {
      const customReplacements = parseCustomReplacements(testCase.text);

      expect(customReplacements).toEqual(testCase.expectedCustomReplacements);
    });
  }
});
