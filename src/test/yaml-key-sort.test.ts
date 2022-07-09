import dedent from 'ts-dedent';
import moment from 'moment';
import {rulesDict} from '../rules';

describe('YAML Key Sort', () => {
  it('When the sort changes the yaml contents and yaml timestamp date modified is active, update date modified value', () => {
    const before = dedent`
      ---
      language: Typescript
      type: programming
      tags: computer
      keywords: []
      status: WIP
      date: 01/15/2022
      modified: Wednesday, January 1st 2020, 12:00:00 am
      ---
      `;
    const after = dedent`
      ---
      date: 01/15/2022
      type: programming
      language: Typescript
      tags: computer
      keywords: []
      status: WIP
      modified: Thursday, January 2nd 2020, 12:00:00 am
      ---
      `;

    const options = {
      'YAML Key Priority Sort Order': 'date\ntype\nlanguage',
      'YAML Sort Order for Other Keys': 'None',
      'Priority Keys at Start of YAML': true,
      'Date Modified Key': 'modified',
      'Current Time': moment('Thursday, January 2nd 2020, 12:00:00 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
      'Already Modified': false,
      'Format': 'dddd, MMMM Do YYYY, h:mm:ss a',
      'moment': moment,
      'Yaml Timestamp Date Modified Enabled': true,
    };
    expect(rulesDict['yaml-key-sort'].apply(before, options)).toBe(after);
  });
});
