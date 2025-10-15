import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, DropdownOptionBuilder, ExampleBuilder, MomentFormatOptionBuilder, OptionBuilderBase, TextOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {formatYAML, initYAML} from '../utils/yaml';
import {moment} from 'obsidian';
import {escapeDollarSigns} from '../utils/regex';
import {insert} from '../utils/strings';
import parseFormat from 'moment-parseformat';
import {getTextInLanguage} from '../lang/helpers';
import {AfterFileChangeLintTimes} from '../settings-data';

type DateCreatedSourceOfTruth = 'file system' | 'frontmatter';
type DateModifiedSourceOfTruth = 'file system' | 'user or Linter edits';

class YamlTimestampOptions implements Options {
  @RuleBuilder.noSettingControl()
    alreadyModified?: boolean;

  dateCreatedKey?: string = 'date created';
  dateCreated?: boolean = true;
  dateCreatedSourceOfTruth?: DateCreatedSourceOfTruth = 'file system';
  dateModifiedSourceOfTruth?: DateModifiedSourceOfTruth = 'file system';

  @RuleBuilder.noSettingControl()
    fileCreatedTime?: string;

  format?: string = 'dddd, MMMM Do YYYY, h:mm:ss a';
  dateModified?: boolean = true;
  dateModifiedKey?: string = 'date modified';

  convertToUTC?: boolean = false;

  // This is not used in the rule itself. It is used for running this rule as a standalone when
  // editor content is updated.
  timestampUpdateOnFileContentUpdated?: AfterFileChangeLintTimes =AfterFileChangeLintTimes.Never;

  @RuleBuilder.noSettingControl()
    fileModifiedTime?: string;

  @RuleBuilder.noSettingControl()
    locale?: string = 'en';

  @RuleBuilder.noSettingControl()
    currentTime?: moment.Moment;

  @RuleBuilder.noSettingControl()
    fileName?: string;
}

@RuleBuilder.register
export default class YamlTimestamp extends RuleBuilder<YamlTimestampOptions> {
  constructor() {
    super({
      nameKey: 'rules.yaml-timestamp.name',
      descriptionKey: 'rules.yaml-timestamp.description',
      type: RuleType.YAML,
      hasSpecialExecutionOrder: true,
    });
  }
  get OptionsClass(): new () => YamlTimestampOptions {
    return YamlTimestampOptions;
  }
  apply(text: string, options: YamlTimestampOptions): string {
    let textModified = options.alreadyModified;
    const newText = initYAML(text);
    textModified = textModified || newText !== text;
    options.format = options.format.trimEnd();

    return formatYAML(newText, (text) => {
      if (options.dateCreated) {
        let newTextModified = false;
        [text, newTextModified] = this.handleDateCreatedValue(text, options);

        textModified = textModified || newTextModified;
      }

      if (options.dateModified) {
        text = this.handleDateModifiedValue(text, textModified, options);
      }

      return text;
    });
  }
  handleDateCreatedValue(text: string, options: YamlTimestampOptions): [string, boolean] {
    let textModified = false;
    const created_match_str = `\n${options.dateCreatedKey}: [^\n]+\n`;
    const created_key_match_str = `\n${options.dateCreatedKey}:[ \t]*\n`;
    const created_key_match = new RegExp(created_key_match_str);
    const created_match = new RegExp(created_match_str);

    const created_date = moment(options.fileCreatedTime);
    created_date.locale(options.locale);

    const formatted_date = options.convertToUTC ? created_date.utc().format(options.format) : created_date.format(options.format);
    const created_date_line = `\n${options.dateCreatedKey}: ${formatted_date}`;

    const keyWithValueFound = created_match.test(text);
    if (!keyWithValueFound && created_key_match.test(text)) {
      text = text.replace(
          created_key_match,
          escapeDollarSigns(created_date_line) + '\n',
      );

      textModified = true;
    } else if (!keyWithValueFound) {
      const yaml_end = text.indexOf('\n---');
      text = insert(
          text,
          yaml_end,
          `\n${options.dateCreatedKey}: ${formatted_date}`,
      );

      textModified = true;
    } else if (keyWithValueFound) {
      const createdDateString = this.getYAMLTimestampString(text, created_match, options.dateCreatedKey);
      const actualFormat = parseFormat(createdDateString);
      if (options.dateCreatedSourceOfTruth == 'frontmatter' && options.format !== actualFormat) {
        const yamlCreatedDateTime = this.parseValueToCurrentFormatIfPossible(createdDateString, options.format, options.locale, options.convertToUTC);
        if (yamlCreatedDateTime == null) {
          throw new Error(getTextInLanguage('logs.invalid-date-format-error').replace('{DATE}', createdDateString).replace('{FILE_NAME}', options.fileName));
        }

        const formattedYamlCreatedDate = options.convertToUTC ? yamlCreatedDateTime.utc().format(options.format) : yamlCreatedDateTime.format(options.format);

        if (formattedYamlCreatedDate !== createdDateString) {
          const created_date_yaml_line = `\n${options.dateCreatedKey}: ${formattedYamlCreatedDate}`;
          text = text.replace(
              created_match,
              escapeDollarSigns(created_date_yaml_line) + '\n',
          );

          textModified = true;
        }
      } else if (options.dateCreatedSourceOfTruth != 'frontmatter') {
        // due to how moment validation works for formats, we must check if the output string is the same for the provided value since
        // parsing when it has escaped characters in it does not result in a valid value
        // see https://github.com/platers/obsidian-linter/issues/1411
        const createdDateTime = moment(createdDateString, options.format, options.locale);
        // to keep backwards compatibility, we will just go ahead and say that the format output must be equal if the format is not blank
        if (createdDateTime == undefined || !createdDateTime.isValid() || (options.format !== '' && createdDateTime.format(options.format) != createdDateString)) {
          text = text.replace(
              created_match,
              escapeDollarSigns(created_date_line) + '\n',
          );

          textModified = true;
        }
      }
    }

    return [text, textModified];
  }
  handleDateModifiedValue(text: string, textModified: boolean, options: YamlTimestampOptions): string {
    const modified_match_str = `\n${options.dateModifiedKey}: [^\n]+\n`;
    const modified_key_match_str = `\n${options.dateModifiedKey}:[ \t]*\n`;
    const modified_key_match = new RegExp(modified_key_match_str);
    const modified_match = new RegExp(modified_match_str);

    const modified_date = moment(options.fileModifiedTime);
    modified_date.locale(options.locale);
    // using the current time helps prevent issues where the previous modified time was greater
    // than 5 seconds prior to the time the linter will finish with the file (i.e. helps prevent accidental infinite loops on updating the date modified value)
    const formatted_modified_date = options.convertToUTC ? options.currentTime.utc().format(options.format) : options.currentTime.format(options.format);
    const modified_date_line = `\n${options.dateModifiedKey}: ${formatted_modified_date}`;

    const keyWithValueFound = modified_match.test(text);
    if (keyWithValueFound) {
      // due to how moment validation works for formats, we must check if the output string is the same for the provided value since
      // parsing when it has escaped characters in it does not result in a valid value
      // see https://github.com/platers/obsidian-linter/issues/1411
      const originalString = this.getYAMLTimestampString(text, modified_match, options.dateModifiedKey);
      const modifiedDateTime = moment(originalString, options.format, options.locale);
      // conditions when update happens for date modified if the key already exists:
      // 1. the text has been modified
      // 2. the modified date in the frontmatter is not the same locale or format as the settings
      // 3. the source of truth is not when a user or the Linter makes a change to the file and
      // there is a more than 5 second difference between the date modified in the frontmatter and
      // the filesystem
      if (textModified || modifiedDateTime == undefined || !modifiedDateTime.isValid() || modifiedDateTime.format(options.format) != originalString ||
            (options.dateModifiedSourceOfTruth != 'user or Linter edits' && this.getTimeDifferenceInSeconds(modifiedDateTime, modified_date, options) > 5)
      ) {
        text = text.replace(
            modified_match,
            escapeDollarSigns(modified_date_line) + '\n',
        );
      }
    } else if (modified_key_match.test(text)) {
      text = text.replace(
          modified_key_match,
          escapeDollarSigns(modified_date_line) + '\n',
      );
    } else if (!keyWithValueFound) {
      const yaml_end = text.indexOf('\n---');
      text = insert(text, yaml_end, modified_date_line);
    }

    return text;
  }
  parseValueToCurrentFormatIfPossible(timestamp: string, format: string, locale: string, utc: boolean): moment.Moment | null {
    if (timestamp == undefined) {
      return null;
    }

    const desiredFormatDate = utc ? moment.utc(timestamp, format, locale, true) : moment(timestamp, format, locale, true);
    if (desiredFormatDate != undefined && desiredFormatDate.isValid()) {
      return desiredFormatDate;
    }

    const actualFormat = parseFormat(timestamp);
    if (actualFormat != undefined) {
      const date = utc ? moment.utc(timestamp, actualFormat) : moment(timestamp, actualFormat);
      date.locale(locale);

      const formattedDateStr = utc ? date.utc().format(format) : date.format(format);
      return utc ? moment.utc(formattedDateStr, format, locale, true): moment(formattedDateStr, format, locale, true);
    }

    return null;
  }
  getYAMLTimestampString(text: string, matchRegex: RegExp, key: string): string {
    const match = text.match(matchRegex)[0];

    return match.replace(key + ':', '').trim();
  }
  getTimeDifferenceInSeconds(modifiedDateTimeMetadata: moment.Moment, yamlModifiedDateTime: moment.Moment, options: YamlTimestampOptions): number {
    // the metadata value may not be in the correct format, so we need to convert it to the correct format
    // and then do the time comparison otherwise we get erroneously large differences in seconds
    // see https://github.com/platers/obsidian-linter/issues/568
    const formattedDateModifiedDate = moment(yamlModifiedDateTime.format(options.format), options.format, options.locale, true);

    return Math.abs(modifiedDateTimeMetadata.diff(formattedDateModifiedDate, 'seconds'));
  }
  get exampleBuilders(): ExampleBuilder<YamlTimestampOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Adds a header with the date.',
        before: dedent`
          # H1
        `,
        after: dedent`
          ---
          date created: Wednesday, January 1st 2020, 12:00:00 am
          date modified: Thursday, January 2nd 2020, 12:00:05 am
          ---
          # H1
        `,
        options: {
          fileCreatedTime: '2020-01-01T00:00:00-00:00',
          fileModifiedTime: '2020-01-02T00:00:00-00:00',
          currentTime: moment('Thursday, January 2nd 2020, 12:00:05 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
          alreadyModified: false,
        },
      }),
      new ExampleBuilder({
        description: 'dateCreated option is false',
        before: dedent`
          # H1
        `,
        after: dedent`
          ---
          date modified: Thursday, January 2nd 2020, 12:00:05 am
          ---
          # H1
        `,
        options: {
          dateCreated: false,
          fileCreatedTime: '2020-01-01T00:00:00-00:00',
          fileModifiedTime: '2020-01-01T00:00:00-00:00',
          currentTime: moment('Thursday, January 2nd 2020, 12:00:05 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
          alreadyModified: false,
        },
      }),
      new ExampleBuilder({
        description: 'Date Created Key is set',
        before: dedent`
          # H1
        `,
        after: dedent`
          ---
          created: Wednesday, January 1st 2020, 12:00:00 am
          ---
          # H1
        `,
        options: {
          dateCreated: true,
          dateModified: false,
          dateCreatedKey: 'created',
          fileCreatedTime: '2020-01-01T00:00:00-00:00',
          currentTime: moment('Thursday, January 2nd 2020, 12:00:03 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
          alreadyModified: false,
        },
      }),
      new ExampleBuilder({
        description: 'Date Modified Key is set',
        before: dedent`
          # H1
        `,
        after: dedent`
          ---
          modified: Wednesday, January 1st 2020, 4:00:00 pm
          ---
          # H1
        `,
        options: {
          dateCreated: false,
          dateModified: true,
          dateModifiedKey: 'modified',
          fileModifiedTime: '2020-01-01T00:00:00-00:00',
          currentTime: moment('Wednesday, January 1st 2020, 4:00:00 pm', 'dddd, MMMM Do YYYY, h:mm:ss a'),
          alreadyModified: false,
        },
      }),
      new ExampleBuilder({
        description: 'Header is set with convert to UTC option true',
        before: dedent`
          # H1
        `,
        after: dedent`
          ---
          date created: 2020-01-01T14:00:00+00:00
          date modified: 2020-01-02T02:00:05+00:00
          ---
          # H1
        `,
        options: {
          format: 'YYYY-MM-DDTHH:mm:ssZ',
          fileCreatedTime: '2020-01-01T09:00:00-05:00', // 9 AM Eastern Standard Time
          fileModifiedTime: '2020-01-01T21:00:00-05:00', // 9 PM Eastern Standard Time, same day
          currentTime: moment('2020-01-01T21:00:05-05:00', 'YYYY-MM-DDTHH:mm:ssZ'), // 9:00:05 PM EST, same day
          alreadyModified: false,
          convertToUTC: true,
        },
      }),
      new ExampleBuilder({
        description: 'dateCreated option is false with convert to UTC option true',
        before: dedent`
          # H1
        `,
        after: dedent`
          ---
          date modified: 2020-01-02T02:00:05+00:00
          ---
          # H1
        `,
        options: {
          format: 'YYYY-MM-DDTHH:mm:ssZ',
          dateCreated: false,
          fileCreatedTime: '2020-01-01T09:00:00-05:00', // 9 AM Eastern Standard Time
          fileModifiedTime: '2020-01-01T21:00:00-05:00', // 9 PM Eastern Standard Time, same day
          currentTime: moment('2020-01-01T21:00:05-05:00', 'YYYY-MM-DDTHH:mm:ssZ'), // 9:00:05 PM EST, same day
          alreadyModified: false,
          convertToUTC: true,
        },
      }),
      new ExampleBuilder({
        description: 'Date Created Key is set with convert to UTC option true',
        before: dedent`
          # H1
        `,
        after: dedent`
          ---
          created: 2020-01-01T14:00:00+00:00
          ---
          # H1
        `,
        options: {
          format: 'YYYY-MM-DDTHH:mm:ssZ',
          dateCreated: true,
          dateModified: false,
          dateCreatedKey: 'created',
          fileCreatedTime: '2020-01-01T09:00:00-05:00', // 9 AM Eastern Standard Time
          currentTime: moment('2020-01-01T21:00:05-05:00', 'YYYY-MM-DDTHH:mm:ssZ'), // 9:00:05 PM EST, same day
          alreadyModified: false,
          convertToUTC: true,
        },
      }),
      new ExampleBuilder({
        description: 'Date Modified Key is set with convert to UTC option true',
        before: dedent`
          # H1
        `,
        after: dedent`
          ---
          modified: 2020-01-02T02:00:05+00:00
          ---
          # H1
        `,
        options: {
          format: 'YYYY-MM-DDTHH:mm:ssZ',
          dateCreated: false,
          dateModified: true,
          dateModifiedKey: 'modified',
          fileModifiedTime: '2020-01-01T21:00:00-05:00', // 9 PM Eastern Standard Time, same day
          currentTime: moment('2020-01-01T21:00:05-05:00', 'YYYY-MM-DDTHH:mm:ssZ'), // 9:00:05 PM EST, same day
          alreadyModified: false,
          convertToUTC: true,
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<YamlTimestampOptions>[] {
    return [
      new BooleanOptionBuilder({
        OptionsClass: YamlTimestampOptions,
        nameKey: 'rules.yaml-timestamp.date-created.name',
        descriptionKey: 'rules.yaml-timestamp.date-created.description',
        optionsKey: 'dateCreated',
      }),
      new TextOptionBuilder({
        OptionsClass: YamlTimestampOptions,
        nameKey: 'rules.yaml-timestamp.date-created-key.name',
        descriptionKey: 'rules.yaml-timestamp.date-created-key.description',
        optionsKey: 'dateCreatedKey',
      }),
      new DropdownOptionBuilder<YamlTimestampOptions, DateCreatedSourceOfTruth>({
        OptionsClass: YamlTimestampOptions,
        nameKey: 'rules.yaml-timestamp.date-created-source-of-truth.name',
        descriptionKey: 'rules.yaml-timestamp.date-created-source-of-truth.description',
        optionsKey: 'dateCreatedSourceOfTruth',
        records: [
          {
            value: 'file system',
            description: 'The file system date created value is used to set the value of date created in the frontmatter',
          },
          {
            value: 'frontmatter',
            description: 'When a value is present in the frontmatter for date created, this value is used as the value for the date created',
          },
        ],
      }),
      new BooleanOptionBuilder({
        OptionsClass: YamlTimestampOptions,
        nameKey: 'rules.yaml-timestamp.date-modified.name',
        descriptionKey: 'rules.yaml-timestamp.date-modified.description',
        optionsKey: 'dateModified',
      }),
      new TextOptionBuilder({
        OptionsClass: YamlTimestampOptions,
        nameKey: 'rules.yaml-timestamp.date-modified-key.name',
        descriptionKey: 'rules.yaml-timestamp.date-modified-key.description',
        optionsKey: 'dateModifiedKey',
      }),
      new DropdownOptionBuilder<YamlTimestampOptions, DateModifiedSourceOfTruth>({
        OptionsClass: YamlTimestampOptions,
        nameKey: 'rules.yaml-timestamp.date-modified-source-of-truth.name',
        descriptionKey: 'rules.yaml-timestamp.date-modified-source-of-truth.description',
        optionsKey: 'dateModifiedSourceOfTruth',
        records: [
          {
            value: 'file system',
            description: 'The file system date modified value is used to set the value of date modified in the frontmatter',
          },
          {
            value: 'user or Linter edits',
            description: 'When a value is present in the frontmatter for date modified, date modified is kept as is unless the Linter makes a change to a note or the user edits a note with the setting `{NAME}` set to something other than `{NEVER}`.'.replace('{NAME}', getTextInLanguage('rules.yaml-timestamp.update-on-file-contents-updated.name')).replace('{NEVER}', getTextInLanguage('enums.never')),
          },
        ],
      }),
      new MomentFormatOptionBuilder({
        OptionsClass: YamlTimestampOptions,
        nameKey: 'rules.yaml-timestamp.format.name',
        descriptionKey: 'rules.yaml-timestamp.format.description',
        optionsKey: 'format',
      }),
      new BooleanOptionBuilder({
        OptionsClass: YamlTimestampOptions,
        nameKey: 'rules.yaml-timestamp.convert-to-utc.name',
        descriptionKey: 'rules.yaml-timestamp.convert-to-utc.description',
        optionsKey: 'convertToUTC',
      }),
      new DropdownOptionBuilder<YamlTimestampOptions, AfterFileChangeLintTimes>({
        OptionsClass: YamlTimestampOptions,
        nameKey: 'rules.yaml-timestamp.update-on-file-contents-updated.name',
        descriptionKey: 'rules.yaml-timestamp.update-on-file-contents-updated.description',
        optionsKey: 'timestampUpdateOnFileContentUpdated',
        records: [
          {
            value: AfterFileChangeLintTimes.Never,
            description: AfterFileChangeLintTimes.Never,
          },
          {
            value: AfterFileChangeLintTimes.After5Seconds,
            description: AfterFileChangeLintTimes.After5Seconds,
          },
          {
            value: AfterFileChangeLintTimes.After10Seconds,
            description: AfterFileChangeLintTimes.After10Seconds,
          },
          {
            value: AfterFileChangeLintTimes.After15Seconds,
            description: AfterFileChangeLintTimes.After15Seconds,
          },
          {
            value: AfterFileChangeLintTimes.After30Seconds,
            description: AfterFileChangeLintTimes.After30Seconds,
          },
          {
            value: AfterFileChangeLintTimes.After1Minute,
            description: AfterFileChangeLintTimes.After1Minute,
          },
        ],
      }),
    ];
  }
}
