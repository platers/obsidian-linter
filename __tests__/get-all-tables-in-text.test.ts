import {getAllTablesInText} from '../src/utils/mdast';
import dedent from 'ts-dedent';

type tablesInTextTestCase = {
  name: string,
  text: string,
  expectedTablesInText: number,
  expectedPositions: {startIndex:number, endIndex: number}[]
};

const getTablesInTextTestCases: tablesInTextTestCase[] = [
  {
    name: 'matches simple table',
    text: dedent`
      Here is some text
      | column1 | column2 |
      | ------- | ------- |
      | data1   | data2   |
    `,
    expectedTablesInText: 1,
    expectedPositions: [{startIndex: 18, endIndex: 83}],
  },
  {
    name: 'matches empty table as a single table',
    text: dedent`
      Here is some text
      |||
      |-|-|
    `,
    expectedTablesInText: 1,
    expectedPositions: [{startIndex: 18, endIndex: 27}],
  },
  {
    name: 'does not get a table where the header and delimiter have a different cell count',
    text: dedent`
      Here is some text
      |||
      |-|-|-|
    `,
    expectedTablesInText: 0,
    expectedPositions: [],
  },
  {
    name: 'matches table where delimiter has all pipes while the header is missing optional pipes',
    text: dedent`
      Here is some text
      heading1|heading2
      |-|-|
    `,
    expectedTablesInText: 1,
    expectedPositions: [{startIndex: 18, endIndex: 41}],
  },
  {
    name: 'matches table where delimiter has some pipes while the header is missing optional pipes',
    text: dedent`
      Here is some text
      heading1|heading2
      |-|-
    `,
    expectedTablesInText: 1,
    expectedPositions: [{startIndex: 18, endIndex: 40}],
  },
  {
    name: 'matches table where there is trailing space at the end of the table header and delimiter',
    text: dedent`
      Here is some text
      |heading1|heading2|${'  '}
      |-|-|${'  '}
    `,
    expectedTablesInText: 1,
    expectedPositions: [{startIndex: 18, endIndex: 47}],
  },
  {
    name: 'matches table that uses the alignment operators (:) in table delimiter',
    text: dedent`
      Here is some text
      |heading1|heading2|heading3|heading4|heading5
      |:-|-:|-| :----:  |   -${'      '}
    `,
    expectedTablesInText: 1,
    expectedPositions: [{startIndex: 18, endIndex: 93}],
  },
  {
    name: 'does not match table with a delimiter row that has an empty cell devoid of any characters',
    text: dedent`
      Here is some text
      heading1|heading2|heading3
      |:-||-|
    `,
    expectedTablesInText: 0,
    expectedPositions: [],
  },
  {
    name: 'does not match table with a delimiter row that has a cell at the start or middle that is missing a dash',
    text: dedent`
      Here is some text
      heading1|heading2|heading3
      |:-| |-|
    `,
    expectedTablesInText: 0,
    expectedPositions: [],
  },
  {
    name: 'does not match a table without a table header',
    text: dedent`
      Here is some text
      |-|-|-|
    `,
    expectedTablesInText: 0,
    expectedPositions: [],
  },
  {
    name: 'matches text that precedes a table header when the table only has one column',
    text: dedent`
      Here is some text
      |-|
    `,
    expectedTablesInText: 1,
    expectedPositions: [{startIndex: 0, endIndex: 21}],
  },
  {
    name: 'does not match table in blockquote that is missing table separator row',
    text: dedent`
      > Here is some text
      > | Looks like a table | Column2 |
      > | Another | Row |
      > | One | More |
    `,
    expectedTablesInText: 0,
    expectedPositions: [],
  },
  {
    name: 'matches a table in blockquote when it has a separator row',
    text: dedent`
      > Here is some text
      > | Looks like a table | Column2 |
      > | :--- | ----: |
      > | One | More |
    `,
    expectedTablesInText: 1,
    expectedPositions: [{startIndex: 22, endIndex: 90}],
  },
  {
    name: 'matches recognizes two separate tables in a blockquote/callout when there is a blank line between them',
    text: dedent`
      > Here is some text
      > | Looks like a table | Column2 |
      > | :--- | ----: |
      > | One | More |
      >
      > | Header 1 | Header 2 |
      > | -------- | -------- |
      > | Text | Text 2 |
      ${''}
      Some more text here...
    `,
    expectedTablesInText: 2,
    expectedPositions: [{startIndex: 95, endIndex: 164}, {startIndex: 22, endIndex: 90}],
  },
  {
    name: 'matches two tables with a blank line between them',
    text: dedent`
      Here is some text
      | column1 | column2 |
      | ------- | ------- |
      | data1   | data2   |
      ${''}
      | column1 | column2 |
      | ------- | ------- |
      | data3   | data4   |
    `,
    expectedTablesInText: 2,
    expectedPositions: [{startIndex: 85, endIndex: 150}, {startIndex: 18, endIndex: 83}],
  },
  {
    name: 'matches indented table',
    text: dedent`
      Here is some text
      ${'   '}| column1 | column2 |
      ${'   '}| ------- | ------- |
      ${'   '}| data1   | data2   |
    `,
    expectedTablesInText: 1,
    expectedPositions: [{startIndex: 18, endIndex: 92}],
  },
  {
    name: 'does not match YAML indicators',
    text: dedent`
      ---
      ---
    `,
    expectedTablesInText: 0,
    expectedPositions: [],
  },
  {
    name: 'does not match YAML frontmatter',
    text: dedent`
      ---
      date: 06/16/2022
      type: topic
      tags:
      keywords: []
      status: WIP
      ---
    `,
    expectedTablesInText: 0,
    expectedPositions: [],
  },
  {
    name: 'does not match an empty list indicator with a blank line before it',
    text: dedent`
      ## Attendees
      ${''}
      -${' '}
      ${''}
      ## Agenda
    `,
    expectedTablesInText: 0,
    expectedPositions: [],
  },
  { // accounts for https://github.com/platers/obsidian-linter/issues/999
    name: 'handle tables with a escaped pipes in them',
    text: dedent`
      | 1 | 2 |
      | --- | --- |
      | 3 | 4 |

      | [[2024-01-25\\|Thursday]] | [[2024-01-26\\|Friday]] |
      | --- | --- |
      | 3 | 4 |
    `,
    expectedTablesInText: 2,
    expectedPositions: [{startIndex: 35, endIndex: 112}, {startIndex: 0, endIndex: 33}],
  },
  { // accounts for https://github.com/platers/obsidian-linter/issues/1235
    name: 'handle tables with --- in a row',
    text: dedent`
      | test  |
      |:-----:|
      |  ---  |
      |  one  |
      |  two  |
      |  ---  |
      |  ---  |
      | three |
      |  ---  |
      |  ---  |
      |  ---  |
      |  ---  |
      | four  |
      | five  |
    `,
    expectedTablesInText: 1,
    expectedPositions: [{startIndex: 0, endIndex: 140}],
  },
];

describe('Get All Tables in Text', () => {
  for (const testCase of getTablesInTextTestCases) {
    it(testCase.name, () => {
      const tablePositions = getAllTablesInText(testCase.text);

      expect(tablePositions.length).toEqual(testCase.expectedTablesInText);
      expect(tablePositions).toEqual(testCase.expectedPositions);
    });
  }
});
