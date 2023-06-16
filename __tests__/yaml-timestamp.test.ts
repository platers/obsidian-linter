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
    {
      testName: 'When the date format changes and `forceRetentionOfCreatedValue = true`, date created value is based on the one in the YAML frontmatter.',
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
        forceRetentionOfCreatedValue: true,
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
      testName: 'When no changes are made, and force retention of creation date is active, do not update date modified when no change in modification time has been made',
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
        currentTime: moment('Tuesday, February 4th 2020, 6:00:07 pm', 'dddd, MMMM Do YYYY, h:mm:ss a'),
        alreadyModified: false,
        forceRetentionOfCreatedValue: true,
      },
    },
  ],
});

/**
 * "yaml-timestamp": {
      "enabled": true,
      "date-created": true,
      "date-created-key": "created",
      "force-retention-of-create-value": true,
      "date-modified": true,
      "date-modified-key": "modified",
      "format": "YYYY-MM-DDTHH:mm:ssZ"
    },
 */
