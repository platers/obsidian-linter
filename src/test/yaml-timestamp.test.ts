import dedent from 'ts-dedent';
import moment from 'moment';
import {rulesDict} from '../rules';

describe('yaml timestamp', () => {
  it('Doesn\'t add date created if already there', () => {
    const before = dedent`
      ---
      date created: 2019-01-01
      ---
      `;
    const after = dedent`
      ---
      date created: 2019-01-01
      ---
      `;
    expect(rulesDict['yaml-timestamp'].apply(before, {'Date Created': true, 'Date Created Key': 'date created', 'moment': moment})).toBe(after);
  });
  it('Respects created key', () => {
    const before = dedent`
      ---
      created: 2019-01-01
      ---
      `;
    const after = dedent`
      ---
      created: 2019-01-01
      ---
      `;
    expect(rulesDict['yaml-timestamp'].apply(before, {'Date Created': true, 'Date Created Key': 'created', 'moment': moment})).toBe(after);
  });
  it('Respects modified key when nothing has changed', () => {
    const before = dedent`
      ---
      modified: Wednesday, January 1st 2020, 12:00:00 am
      ---
      `;
    const after = dedent`
      ---
      modified: Wednesday, January 1st 2020, 12:00:00 am
      ---
      `;

    const options = {
      'Date Created': false,
      'Date Modified': true,
      'Date Modified Key': 'modified',
      'metadata: file modified time': '2020-01-01T00:00:00-00:00',
      'Current Time': moment('Thursday, January 2nd 2020, 12:00:00 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
      'Already Modified': false,
      'Format': 'dddd, MMMM Do YYYY, h:mm:ss a',
      'moment': moment,
    };
    expect(rulesDict['yaml-timestamp'].apply(before, options)).toBe(after);
  });
  it('Updates modified value when nothing has changed, but date modified is more than 5 seconds different than the file metadata', () => {
    const before = dedent`
      ---
      modified: Wednesday, January 1st 2020, 12:00:00 am
      ---
      `;
    const after = dedent`
      ---
      modified: Thursday, January 2nd 2020, 12:00:00 am
      ---
      `;

    const options = {
      'Date Created': false,
      'Date Modified': true,
      'Date Modified Key': 'modified',
      'metadata: file modified time': '2020-01-02T00:00:03-00:00',
      'Current Time': moment('Thursday, January 2nd 2020, 12:00:00 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
      'Format': 'dddd, MMMM Do YYYY, h:mm:ss a',
      'Already Modified': false,
      'moment': moment,
    };
    expect(rulesDict['yaml-timestamp'].apply(before, options)).toBe(after);
  });
  it('Updates modified value when format has changed', () => {
    const before = dedent`
      ---
      modified: Wednesday, January 1st 2020, 12:00:00 am
      ---
      `;
    const after = dedent`
      ---
      modified: Wednesday, January 1st 2020
      ---
      `;

    const options = {
      'Date Created': false,
      'Date Modified': true,
      'Date Modified Key': 'modified',
      'metadata: file modified time': '2020-01-01T00:00:00-00:00',
      'Current Time': moment('Wednesday, January 1st 2020, 12:00:00 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
      'Format': 'dddd, MMMM Do YYYY',
      'Already Modified': false,
      'moment': moment,
    };
    expect(rulesDict['yaml-timestamp'].apply(before, options)).toBe(after);
  });
  it('Updates modified key when something has changed outside of the YAML timestamp rule', () => {
    const before = dedent`
      ---
      modified: Wednesday, January 1st 2020, 12:00:00 am
      ---
      `;
    const after = dedent`
      ---
      modified: Saturday, February 1st 2020, 12:00:00 am
      ---
      `;

    const options = {
      'Date Created': false,
      'Date Modified': true,
      'Date Modified Key': 'modified',
      'metadata: file modified time': '2020-01-30T00:00:00-00:00',
      'Current Time': moment('Saturday, February 1st 2020, 12:00:00 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
      'Already Modified': true,
      'Format': 'dddd, MMMM Do YYYY, h:mm:ss a',
      'moment': moment,
    };
    expect(rulesDict['yaml-timestamp'].apply(before, options)).toBe(after);
  });
  it('Updates modified key when locale has changed', () => {
    const before = dedent`
      ---
      modified: Wednesday, January 1st 2020, 12:00:00 am
      ---
      `;
    const after = dedent`
      ---
      modified: samedi, février 1er 2020, 12:00:05 am
      ---
      `;

    moment.locale('fr');
    const options = {
      'Date Created': false,
      'Date Modified': true,
      'Date Modified Key': 'modified',
      'metadata: file modified time': '2020-02-01T00:00:00-00:00',
      'Current Time': moment('samedi, février 1er 2020, 12:00:05 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
      'Already Modified': false,
      'Format': 'dddd, MMMM Do YYYY, h:mm:ss a',
      'moment': moment,
    };
    expect(rulesDict['yaml-timestamp'].apply(before, options)).toBe(after);
    moment.locale('en');
  });
  it('Updates modified key when something has changed inside of the YAML timestamp rule', () => {
    const before = dedent`
      ---
      modified: Thursday, January 2nd 2020, 12:00:00 am
      ---
      `;
    const after = dedent`
      ---
      modified: Thursday, January 2nd 2020, 12:00:05 am
      created: Wednesday, January 1st 2020, 12:00:00 am
      ---
      `;

    const options = {
      'Date Created': true,
      'Date Modified': true,
      'Date Created Key': 'created',
      'Date Modified Key': 'modified',
      'metadata: file created time': '2020-01-01T00:00:00-00:00',
      'metadata: file modified time': '2020-01-02T00:00:00-00:00',
      'Current Time': moment('Thursday, January 2nd 2020, 12:00:05 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
      'Already Modified': false,
      'Format': 'dddd, MMMM Do YYYY, h:mm:ss a',
      'moment': moment,
    };
    expect(rulesDict['yaml-timestamp'].apply(before, options)).toBe(after);
  });
  it('Updates modified key when present, but lacks a value', () => {
    const before = dedent`
      ---
      tag: tag1
      modified: 
      location: "path"
      ---
      `;
    const after = dedent`
      ---
      tag: tag1
      modified: Saturday, February 1st 2020, 12:00:00 am
      location: "path"
      ---
      `;

    const options = {
      'Date Created': false,
      'Date Modified': true,
      'Date Modified Key': 'modified',
      'metadata: file modified time': '2020-01-30T00:00:00-00:00',
      'Already Modified': false,
      'Current Time': moment('Saturday, February 1st 2020, 12:00:00 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
      'Format': 'dddd, MMMM Do YYYY, h:mm:ss a',
      'moment': moment,
    };
    expect(rulesDict['yaml-timestamp'].apply(before, options)).toBe(after);
  });
  it('Updates created key when present, but lacks a value', () => {
    const before = dedent`
      ---
      tag: tag1
      created: 
      location: "path"
      ---
      `;
    const after = dedent`
      ---
      tag: tag1
      created: Saturday, February 1st 2020, 12:00:00 am
      location: "path"
      ---
      `;

    const options = {
      'Date Created': true,
      'Date Modified': false,
      'Date Created Key': 'created',
      'metadata: file created time': '2020-02-01T00:00:00-00:00',
      'Already Modified': false,
      'Format': 'dddd, MMMM Do YYYY, h:mm:ss a',
      'moment': moment,
    };
    expect(rulesDict['yaml-timestamp'].apply(before, options)).toBe(after);
  });
  it('Updates created value when format has changed', () => {
    const before = dedent`
      ---
      tag: tag1
      created: Saturday, February 1st 2020, 12:00:00 am
      location: "path"
      ---
      `;
    const after = dedent`
      ---
      tag: tag1
      created: Saturday, February 1st 2020
      location: "path"
      ---
      `;

    const options = {
      'Date Created': true,
      'Date Modified': false,
      'Date Created Key': 'created',
      'metadata: file created time': '2020-02-01T00:00:00-00:00',
      'Format': 'dddd, MMMM Do YYYY',
      'Already Modified': false,
      'moment': moment,
    };
    expect(rulesDict['yaml-timestamp'].apply(before, options)).toBe(after);
  });
  it('Updates created value when locale has changed', () => {
    const before = dedent`
      ---
      tag: tag1
      created: Saturday, February 1st 2020, 12:00:00 am
      location: "path"
      ---
      `;
    const after = dedent`
      ---
      tag: tag1
      created: samedi, février 1er 2020, 12:00:00 am
      location: "path"
      ---
      `;

    moment.locale('fr');
    const options = {
      'Date Created': true,
      'Date Modified': false,
      'Date Created Key': 'created',
      'metadata: file created time': '2020-02-01T00:00:00-00:00',
      'Format': 'dddd, MMMM Do YYYY, h:mm:ss a',
      'Already Modified': false,
      'moment': moment,
    };
    expect(rulesDict['yaml-timestamp'].apply(before, options)).toBe(after);
    moment.locale('en');
  });
  it('Updates modified value when format has changed causing created value updated', () => {
    const before = dedent`
      ---
      tag: tag1
      modified: Saturday, February 1st 2020, 12:00:00 am
      created: Wednesday, January 1st 2020
      location: "path"
      ---
      `;
    const after = dedent`
      ---
      tag: tag1
      modified: Tuesday, February 4th 2020, 6:00:00 pm
      created: Wednesday, January 1st 2020, 12:00:00 am
      location: "path"
      ---
      `;

    const options = {
      'Date Created': true,
      'Date Modified': true,
      'Date Modified Key': 'modified',
      'Date Created Key': 'created',
      'metadata: file created time': '2020-01-01T00:00:00-00:00',
      'metadata: file modified time': '2020-02-02T00:00:00-00:00',
      'Current Time': moment('Tuesday, February 4th 2020, 6:00:00 pm', 'dddd, MMMM Do YYYY, h:mm:ss a'),
      'Format': 'dddd, MMMM Do YYYY, h:mm:ss a',
      'Already Modified': false,
      'moment': moment,
    };
    expect(rulesDict['yaml-timestamp'].apply(before, options)).toBe(after);
  });
});
