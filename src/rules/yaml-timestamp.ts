import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, ExampleBuilder, MomentFormatOptionBuilder, OptionBuilderBase, TextOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {formatYAML, initYAML} from '../utils/yaml';
import {moment} from 'obsidian';
import {escapeDollarSigns} from '../utils/regex';
import {insert} from '../utils/strings';

class YamlTimestampOptions implements Options {
  @RuleBuilder.noSettingControl()
    alreadyModified?: boolean;

  dateCreatedKey?: string = 'date created';
  dateCreated?: boolean = true;

  @RuleBuilder.noSettingControl()
    fileCreatedTime?: string;

  format?: string = 'dddd, MMMM Do YYYY, h:mm:ss a';
  dateModified?: boolean = true;
  dateModifiedKey?: string = 'date modified';

  @RuleBuilder.noSettingControl()
    fileModifiedTime?: string;

  @RuleBuilder.noSettingControl()
    locale?: string = 'en';

  @RuleBuilder.noSettingControl()
    currentTime?: moment.Moment;
}

@RuleBuilder.register
export default class YamlTimestamp extends RuleBuilder<YamlTimestampOptions> {
  constructor() {
    super({
      nameTextKey: 'yaml-timestamp-name',
      descriptionTextKey: 'yaml-timestamp-description',
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

    return formatYAML(newText, (text) => {
      const created_match_str = `\n${options.dateCreatedKey}: [^\n]+\n`;
      const created_key_match_str = `\n${options.dateCreatedKey}:[ \t]*\n`;
      const created_key_match = new RegExp(created_key_match_str);
      const created_match = new RegExp(created_match_str);

      if (options.dateCreated) {
        const created_date = moment(options.fileCreatedTime);
        created_date.locale(options.locale);

        const formatted_date = created_date.format(options.format);
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
          const createdDateTime = moment(text.match(created_match)[0].replace(options.dateCreatedKey + ':', '').trim(), options.format, options.locale, true);
          if (createdDateTime == undefined || !createdDateTime.isValid()) {
            text = text.replace(
                created_match,
                escapeDollarSigns(created_date_line) + '\n',
            );

            textModified = true;
          }
        }
      }

      if (options.dateModified) {
        const modified_match_str = `\n${options.dateModifiedKey}: [^\n]+\n`;
        const modified_key_match_str = `\n${options.dateModifiedKey}:[ \t]*\n`;
        const modified_key_match = new RegExp(modified_key_match_str);
        const modified_match = new RegExp(modified_match_str);

        const modified_date = moment(options.fileModifiedTime);
        modified_date.locale(options.locale);
        // using the current time helps prevent issues where the previous modified time was greater
        // than 5 seconds prior to the time the linter will finish with the file (i.e. helps prevent accidental infinite loops on updating the date modified value)
        const formatted_modified_date = options.currentTime.format(options.format);
        const modified_date_line = `\n${options.dateModifiedKey}: ${formatted_modified_date}`;

        const keyWithValueFound = modified_match.test(text);
        if (keyWithValueFound) {
          const modifiedDateTime = moment(text.match(modified_match)[0].replace(options.dateModifiedKey + ':', '').trim(), options.format, options.locale, true);
          if (textModified || modifiedDateTime == undefined || !modifiedDateTime.isValid() ||
            this.getTimeDifferenceInSeconds(modifiedDateTime, modified_date, options) > 5
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
      }

      return text;
    });
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
    ];
  }
  get optionBuilders(): OptionBuilderBase<YamlTimestampOptions>[] {
    return [
      new BooleanOptionBuilder({
        OptionsClass: YamlTimestampOptions,
        nameTextKey: 'yaml-timestamp-date-created-name',
        descriptionTextKey: 'yaml-timestamp-date-created-description',
        optionsKey: 'dateCreated',
      }),
      new TextOptionBuilder({
        OptionsClass: YamlTimestampOptions,
        nameTextKey: 'yaml-timestamp-date-created-key-name',
        descriptionTextKey: 'yaml-timestamp-date-created-key-description',
        optionsKey: 'dateCreatedKey',
      }),
      new BooleanOptionBuilder({
        OptionsClass: YamlTimestampOptions,
        nameTextKey: 'yaml-timestamp-date-modified-name',
        descriptionTextKey: 'yaml-timestamp-date-modified-description',
        optionsKey: 'dateModified',
      }),
      new TextOptionBuilder({
        OptionsClass: YamlTimestampOptions,
        nameTextKey: 'yaml-timestamp-date-modified-key-name',
        descriptionTextKey: 'yaml-timestamp-date-modified-key-description',
        optionsKey: 'dateModifiedKey',
      }),
      new MomentFormatOptionBuilder({
        OptionsClass: YamlTimestampOptions,
        nameTextKey: 'yaml-timestamp-format-name',
        descriptionTextKey: 'yaml-timestamp-format-description',
        optionsKey: 'format',
      }),
    ];
  }
}
