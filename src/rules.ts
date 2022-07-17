import {
  Option,
  BooleanOption,
} from './option';

export type Options = { [optionName: string]: any };
type ApplyFunction = (text: string, options?: Options) => string;

export interface LinterSettings {
  ruleConfigs: {
    [ruleName: string]: Options;
  };
  lintOnSave: boolean;
  displayChanged: boolean;
  foldersToIgnore: string[];
  linterLocale: string;
  logLevel: number;
}
/* eslint-disable no-unused-vars */
export enum RuleType {
  YAML = 'YAML',
  HEADING = 'Heading',
  FOOTNOTE = 'Footnote',
  CONTENT = 'Content',
  SPACING = 'Spacing',
}
/* eslint-enable no-unused-vars */

/** Class representing a rule */
export class Rule {
  public name: string;
  public description: string;
  public type: RuleType;
  public options: Array<Option>;
  public apply: ApplyFunction;

  public examples: Array<Example>;

  /**
   * Create a rule
   * @param {string} name - The name of the rule
   * @param {string} description - The description of the rule
   * @param {RuleType} type - The type of the rule
   * @param {ApplyFunction} apply - The function to apply the rule
   * @param {Array<Example>} examples - The examples to be displayed in the documentation
   * @param {Array<Option>} [options=[]] - The options of the rule to be displayed in the documentation
   */
  constructor(
      name: string,
      description: string,
      type: RuleType,
      apply: ApplyFunction,
      examples: Array<Example>,
      options: Array<Option> = [],
  ) {
    this.name = name;
    this.description = description;
    this.type = type;
    this.apply = apply;
    this.examples = examples;

    options.unshift(new BooleanOption(this.description, '', false));
    for (const option of options) {
      option.ruleName = name;
    }
    this.options = options;
  }

  public alias(): string {
    return this.name.replace(/ /g, '-').toLowerCase();
  }

  public getDefaultOptions() {
    const options: { [optionName: string]: any } = {};

    for (const option of this.options) {
      options[option.name] = option.defaultValue;
    }

    return options;
  }

  public getOptions(settings: LinterSettings) {
    return settings.ruleConfigs[this.name];
  }

  public getURL(): string {
    const url =
      'https://github.com/platers/obsidian-linter/blob/master/docs/rules.md';
    return url + '#' + this.alias();
  }

  public enabledOptionName(): string {
    return this.options[0].name;
  }
}

/** Class representing an example of a rule */
export class Example {
  public description: string;
  public options: Options;

  public before: string;
  public after: string;

  /**
   * Create an example
   * @param {string} description - The description of the example
   * @param {string} before - The text before the rule is applied
   * @param {string} after - The text after the rule is applied
   * @param {object} options - The options of the example
   */
  constructor(
      description: string,
      before: string,
      after: string,
      options: Options = {},
  ) {
    this.description = description;
    this.options = options;
    this.before = before;
    this.after = after;
  }
}

