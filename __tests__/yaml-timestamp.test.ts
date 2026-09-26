import dedent from 'ts-dedent';
import moment from 'moment';
import {ruleTest} from './common';
import YamlTimestamp from '../src/rules/yaml-timestamp';

ruleTest({
  RuleBuilderClass: YamlTimestamp,
  testCases: [
    {
      testName: 'Doesn\'t add date created if already there',
      before: dedent`
        ---
        date created: 2019-01-01
        ---
      `,
      after: dedent`
        ---
        date created: 2019-01-01
        ---
      `,
      options: {
        dateModified: false,
        format: '',
      },
    },
    {
      testName: 'Respects created key',
      before: dedent`
        ---
        created: 2019-01-01
        ---
      `,
      after: dedent`
        ---
        created: 2019-01-01
        ---
      `,
      options: {
        dateModified: false,
        dateCreatedKey: 'created',
        format: '',
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/861
      testName: 'When format ends in whitespace, date created is not changed when time updates',
      before: dedent`
        ---
        created: Wednesday, January 1st 2020, 12:00 am
        modified: Thursday, January 2nd 2020, 12:00 am
        ---
      `,
      after: dedent`
        ---
        created: Wednesday, January 1st 2020, 12:00 am
        modified: Thursday, January 2nd 2020, 12:00 am
        ---
      `,
      options: {
        dateCreated: true,
        dateCreatedKey: 'created',
        dateModified: true,
        dateModifiedKey: 'modified',
        format: 'dddd, MMMM Do YYYY, h:mm a ',
        currentTime: moment('Thursday, January 2nd 2020, 12:01 am', 'dddd, MMMM Do YYYY, h:mm a'),
        alreadyModified: false,
        dateCreatedSourceOfTruth: 'frontmatter',
        fileModifiedTime: '2020-01-02T00:00:00-00',
      },
    },
    {
      testName: 'When the date format changes and `dateCreatedSourceOfTruth = frontmatter`, date created value is based on the one in the YAML frontmatter.',
      before: dedent`
        ---
        created: Wednesday, January 1st 2020, 12:00:00 am
        ---
      `,
      after: dedent`
        ---
        created: 2020, 12:00:00 am
        ---
      `,
      options: {
        dateModified: false,
        dateCreatedKey: 'created',
        dateCreatedSourceOfTruth: 'frontmatter',
        format: 'YYYY, h:mm:ss a',
        locale: 'en',
      },
    },
    {
      testName: 'Respects modified key when nothing has changed',
      before: dedent`
        ---
        modified: Wednesday, January 1st 2020, 12:00:00 am
        ---
      `,
      after: dedent`
        ---
        modified: Wednesday, January 1st 2020, 12:00:00 am
        ---
      `,
      options: {
        dateCreated: false,
        dateModifiedKey: 'modified',
        fileModifiedTime: '2020-01-01T00:00:00-00:00',
        currentTime: moment('Thursday, January 2nd 2020, 12:00:00 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
        alreadyModified: false,
      },
    },
    {
      testName: 'Updates modified value when nothing has changed, but date modified is more than 5 seconds different than the file metadata',
      before: dedent`
        ---
        modified: Wednesday, January 1st 2020, 12:00:00 am
        ---
      `,
      after: dedent`
        ---
        modified: Thursday, January 2nd 2020, 12:00:00 am
        ---
      `,
      options: {
        dateCreated: false,
        dateModifiedKey: 'modified',
        fileModifiedTime: '2020-01-02T00:00:03-00:00',
        currentTime: moment('Thursday, January 2nd 2020, 12:00:00 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
        alreadyModified: false,
      },
    },
    {
      testName: 'Updates modified value when format has changed',
      before: dedent`
        ---
        modified: Wednesday, January 1st 2020, 12:00:00 am
        ---
      `,
      after: dedent`
        ---
        modified: Wednesday, January 1st 2020
        ---
      `,
      options: {
        dateCreated: false,
        dateModifiedKey: 'modified',
        fileModifiedTime: '2020-01-01T00:00:00-00:00',
        currentTime: moment('Wednesday, January 1st 2020, 12:00:00 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
        alreadyModified: false,
        format: 'dddd, MMMM Do YYYY',
      },
    },
    {
      testName: 'Updates modified value when format has changed',
      before: dedent`
        ---
        modified: Wednesday, January 1st 2020, 12:00:00 am
        ---
      `,
      after: dedent`
        ---
        modified: Wednesday, January 1st 2020
        ---
      `,
      options: {
        dateCreated: false,
        dateModifiedKey: 'modified',
        fileModifiedTime: '2020-01-01T00:00:00-00:00',
        currentTime: moment('Wednesday, January 1st 2020, 12:00:00 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
        alreadyModified: false,
        format: 'dddd, MMMM Do YYYY',
      },
    },
    {
      testName: 'Updates modified key when something has changed outside of the YAML timestamp rule',
      before: dedent`
        ---
        modified: Wednesday, January 1st 2020, 12:00:00 am
        ---
      `,
      after: dedent`
        ---
        modified: Saturday, February 1st 2020, 12:00:00 am
        ---
      `,
      options: {
        dateCreated: false,
        dateModifiedKey: 'modified',
        fileModifiedTime: '2020-01-30T00:00:00-00:00',
        currentTime: moment('Saturday, February 1st 2020, 12:00:00 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
        alreadyModified: true,
      },
    },
    {
      testName: 'Updates modified key when locale has changed',
      before: dedent`
        ---
        modified: Wednesday, January 1st 2020, 12:00:00 am
        ---
      `,
      after: dedent`
        ---
        modified: samedi, février 1er 2020, 12:00:05 am
        ---
      `,
      options: () => {
        const locale = 'fr';
        return {
          dateCreated: false,
          dateModifiedKey: 'modified',
          fileModifiedTime: '2020-02-01T00:00:00-00:00',
          currentTime: moment('samedi, février 1er 2020, 12:00:05 am', 'dddd, MMMM Do YYYY, h:mm:ss a', locale),
          alreadyModified: false,
          locale: locale,
        };
      },
    },
    {
      testName: 'Updates modified key when something has changed inside of the YAML timestamp rule',
      before: dedent`
        ---
        modified: Thursday, January 2nd 2020, 12:00:00 am
        ---
      `,
      after: dedent`
        ---
        modified: Thursday, January 2nd 2020, 12:00:05 am
        created: Wednesday, January 1st 2020, 12:00:00 am
        ---
      `,
      options: {
        dateCreatedKey: 'created',
        dateModifiedKey: 'modified',
        fileCreatedTime: '2020-01-01T00:00:00-00:00',
        fileModifiedTime: '2020-01-02T00:00:00-00:00',
        currentTime: moment('Thursday, January 2nd 2020, 12:00:05 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
        alreadyModified: false,
      },
    },
    {
      testName: 'Updates modified key when present, but lacks a value',
      before: dedent`
        ---
        tag: tag1
        modified: ${''}
        location: "path"
        ---
      `,
      after: dedent`
        ---
        tag: tag1
        modified: Saturday, February 1st 2020, 12:00:00 am
        location: "path"
        ---
      `,
      options: {
        dateCreated: false,
        dateModifiedKey: 'modified',
        fileModifiedTime: '2020-01-30T00:00:00-00:00',
        alreadyModified: false,
        currentTime: moment('Saturday, February 1st 2020, 12:00:00 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
      },
    },
    {
      testName: 'Updates created key when present, but lacks a value',
      before: dedent`
        ---
        tag: tag1
        created: ${''}
        location: "path"
        ---
      `,
      after: dedent`
        ---
        tag: tag1
        created: Saturday, February 1st 2020, 12:00:00 am
        location: "path"
        ---
      `,
      options: {
        dateModified: false,
        dateCreatedKey: 'created',
        fileCreatedTime: '2020-02-01T00:00:00-00:00',
        alreadyModified: false,
      },
    },
    {
      testName: 'Updates created value when format has changed',
      before: dedent`
        ---
        tag: tag1
        created: Saturday, February 1st 2020, 12:00:00 am
        location: "path"
        ---
      `,
      after: dedent`
        ---
        tag: tag1
        created: Saturday, February 1st 2020
        location: "path"
        ---
      `,
      options: {
        dateModified: false,
        dateCreatedKey: 'created',
        fileCreatedTime: '2020-02-01T00:00:00-00:00',
        alreadyModified: false,
        format: 'dddd, MMMM Do YYYY',
      },
    },
    {
      testName: 'Updates created value when locale has changed',
      before: dedent`
        ---
        tag: tag1
        created: Saturday, February 1st 2020, 12:00:00 am
        location: "path"
        ---
      `,
      after: dedent`
        ---
        tag: tag1
        created: samedi, février 1er 2020, 12:00:00 am
        location: "path"
        ---
      `,
      options: () => {
        return {
          dateModified: false,
          dateCreatedKey: 'created',
          fileCreatedTime: '2020-02-01T00:00:00-00:00',
          alreadyModified: false,
          locale: 'fr',
        };
      },
    },
    {
      testName: 'Updates modified value when format has changed causing created value updated',
      before: dedent`
        ---
        tag: tag1
        modified: Saturday, February 1st 2020, 12:00:00 am
        created: Wednesday, January 1st 2020
        location: "path"
        ---
      `,
      after: dedent`
        ---
        tag: tag1
        modified: Tuesday, February 4th 2020, 6:00:00 pm
        created: Wednesday, January 1st 2020, 12:00:00 am
        location: "path"
        ---
      `,
      options: {
        dateCreatedKey: 'created',
        dateModifiedKey: 'modified',
        fileCreatedTime: '2020-01-01T00:00:00-00:00',
        currentTime: moment('Tuesday, February 4th 2020, 6:00:00 pm', 'dddd, MMMM Do YYYY, h:mm:ss a'),
        alreadyModified: false,
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/745
      testName: 'When no changes are made, and frontmatter is the source of truth, do not update date modified when no change in modification time has been made',
      before: dedent`
        ---
        tag: tag1
        modified: Tuesday, February 4th 2020, 6:00:00 pm
        created: Wednesday, January 1st 2020, 12:00:00 am
        location: "path"
        ---
      `,
      after: dedent`
        ---
        tag: tag1
        modified: Tuesday, February 4th 2020, 6:00:00 pm
        created: Wednesday, January 1st 2020, 12:00:00 am
        location: "path"
        ---
      `,
      options: {
        dateCreatedKey: 'created',
        dateModifiedKey: 'modified',
        fileCreatedTime: '2020-01-01T00:00:00-00:00',
        fileModifiedTime: '2020-02-04T18:00:00-00:00',
        currentTime: moment('Tuesday, February 4th 2020, 6:00:07 pm', 'dddd, MMMM Do YYYY, h:mm:ss a'),
        alreadyModified: false,
        dateCreatedSourceOfTruth: 'frontmatter',
      },
    },
    {
      testName: 'When creation date exists and frontmatter is the source of truth and convert to UTC are true, creation date should remain unchanged',
      before: dedent`
        ---
        created: 2019-12-31T14:00:00+00:00
        ---
      `,
      after: dedent`
        ---
        created: 2019-12-31T14:00:00+00:00
        ---
      `,
      options: {
        format: 'YYYY-MM-DDTHH:mm:ssZ',
        dateCreated: true,
        dateCreatedKey: 'created',
        dateModified: false,
        fileCreatedTime: '2020-01-01T09:00:00-05:00', // 9 AM Eastern Standard Time
        currentTime: moment('2020-01-01T21:00:05-05:00', 'YYYY-MM-DDTHH:mm:ssZ'), // 9:00:05 PM EST, same day
        dateCreatedSourceOfTruth: 'frontmatter',
        convertToUTC: true,
      },
    },
    {
      testName: 'When timestamp format has changed and convert to UTC is true, updated timestamps should be in UTC',
      before: dedent`
        ---
        created: Wed, 1 Jan 2020 09:00:00 -05:00
        modified: Wed, 1 Jan 2020 18:00:00 -05:00
        ---
      `,
      after: dedent`
        ---
        created: 2020-01-01T14:00:00+00:00
        modified: 2020-01-02T02:00:05+00:00
        ---
      `,
      options: {
        format: 'YYYY-MM-DDTHH:mm:ssZ',
        dateCreated: true,
        dateCreatedKey: 'created',
        dateModified: true,
        dateModifiedKey: 'modified',
        fileCreatedTime: '2020-01-01T09:00:00-05:00', // 9 AM Eastern Standard Time
        fileModifiedTime: '2020-01-01T21:00:00-05:00', // 9 PM Eastern Standard Time, same day
        currentTime: moment('2020-01-01T21:00:05-05:00', 'YYYY-MM-DDTHH:mm:ssZ'), // 9:00:05 PM EST, same day
        convertToUTC: true,
      },
    },
    {
      testName: 'When changes are made prior to the YAML timestamp rule and user and Linter edits are the source of truth, update date modified',
      before: dedent`
        ---
        tag: tag1
        modified: Tuesday, February 4th 2020, 6:00:00 pm
        created: Wednesday, January 1st 2020, 12:00:00 am
        location: "path"
        ---
      `,
      after: dedent`
        ---
        tag: tag1
        modified: Tuesday, February 4th 2020, 6:00:07 pm
        created: Wednesday, January 1st 2020, 12:00:00 am
        location: "path"
        ---
      `,
      options: {
        dateCreatedKey: 'created',
        dateModifiedKey: 'modified',
        fileCreatedTime: '2020-01-01T00:00:00-00:00',
        fileModifiedTime: '2020-02-04T18:00:00-00:00',
        currentTime: moment('Tuesday, February 4th 2020, 6:00:07 pm', 'dddd, MMMM Do YYYY, h:mm:ss a'),
        alreadyModified: true,
        dateCreatedSourceOfTruth: 'frontmatter',
        dateModifiedSourceOfTruth: 'user or Linter edits',
      },
    },
    {
      testName: 'When no changes are made prior to the YAML timestamp rule, the created date format is different from the current format in settings, and user and Linter edits are the source of truth, update date modified',
      before: dedent`
        ---
        tag: tag1
        modified: Tuesday, February 4th 2020, 6:00:00 pm
        created: Wednesday, January 1st 2020, 12:00 am
        location: "path"
        ---
      `,
      after: dedent`
        ---
        tag: tag1
        modified: Tuesday, February 4th 2020, 6:00:07 pm
        created: Wednesday, January 1st 2020, 12:00:00 am
        location: "path"
        ---
      `,
      options: {
        dateCreatedKey: 'created',
        dateModifiedKey: 'modified',
        fileCreatedTime: '2020-01-01T00:00:00-00:00',
        fileModifiedTime: '2020-02-04T18:00:00-00:00',
        currentTime: moment('Tuesday, February 4th 2020, 6:00:07 pm', 'dddd, MMMM Do YYYY, h:mm:ss a'),
        alreadyModified: false,
        dateCreatedSourceOfTruth: 'frontmatter',
        dateModifiedSourceOfTruth: 'user or Linter edits',
      },
    },
    {
      testName: 'When no changes are made prior to the YAML timestamp rule, the modified date format is different from the current format in settings, and user and Linter edits are the source of truth, update date modified',
      before: dedent`
        ---
        tag: tag1
        modified: Tuesday, February 4th 2020, 6:00 pm
        created: Wednesday, January 1st 2020, 12:00:00 am
        location: "path"
        ---
      `,
      after: dedent`
        ---
        tag: tag1
        modified: Tuesday, February 4th 2020, 6:00:07 pm
        created: Wednesday, January 1st 2020, 12:00:00 am
        location: "path"
        ---
      `,
      options: {
        dateCreatedKey: 'created',
        dateModifiedKey: 'modified',
        fileCreatedTime: '2020-01-01T00:00:00-00:00',
        fileModifiedTime: '2020-02-04T18:00:00-00:00',
        currentTime: moment('Tuesday, February 4th 2020, 6:00:07 pm', 'dddd, MMMM Do YYYY, h:mm:ss a'),
        alreadyModified: false,
        dateCreatedSourceOfTruth: 'frontmatter',
        dateModifiedSourceOfTruth: 'user or Linter edits',
      },
    },
    {
      testName: 'When no changes are made prior to the YAML timestamp rule, the file system date modified is more than 5 seconds different from the date modified, and user and Linter edits are the source of truth, do not update date modified',
      before: dedent`
        ---
        tag: tag1
        modified: Tuesday, February 4th 2020, 6:00:00 pm
        created: Wednesday, January 1st 2020, 12:00:00 am
        location: "path"
        ---
      `,
      after: dedent`
        ---
        tag: tag1
        modified: Tuesday, February 4th 2020, 6:00:00 pm
        created: Wednesday, January 1st 2020, 12:00:00 am
        location: "path"
        ---
      `,
      options: {
        dateCreatedKey: 'created',
        dateModifiedKey: 'modified',
        fileCreatedTime: '2020-01-01T00:00:00-00:00',
        fileModifiedTime: '2020-02-05T18:00:00-00:00',
        currentTime: moment('Tuesday, February 5th 2020, 6:00:07 pm', 'dddd, MMMM Do YYYY, h:mm:ss a'),
        alreadyModified: false,
        dateCreatedSourceOfTruth: 'frontmatter',
        dateModifiedSourceOfTruth: 'user or Linter edits',
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1411
      testName: 'When the format for the file has escaped characters, if it matches the original format and the source of truth is not filesystem, then it should not update the date modified',
      before: dedent`
        ---
        modified_on: "[[2025-10-11]]"
        ---
      `,
      after: dedent`
        ---
        modified_on: "[[2025-10-11]]"
        ---
      `,
      options: {
        dateCreated: false,
        format: '"[[[]YYYY-MM-DD[]]]"',
        dateModifiedKey: 'modified_on',
        fileCreatedTime: '2020-01-01T00:00:00-00:00',
        fileModifiedTime: '2020-02-05T18:00:00-00:00',
        currentTime: moment('Tuesday, February 5th 2026, 6:00:07 pm', 'dddd, MMMM Do YYYY, h:mm:ss a'),
        alreadyModified: false,
        dateModifiedSourceOfTruth: 'user or Linter edits',
      },
    },
  ],
});
