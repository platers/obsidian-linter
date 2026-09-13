import {
  getExactDisabledRuleValue,
  getYAMLText,
} from './utils/yaml';
import {
  Option,
  BooleanOption,
} from './option';
import {LinterError} from './linter-error';
import {getTextInLanguage, LanguageStringKey} from './lang/helpers';
import {ignoreListOfTypes, IgnoreType} from './utils/ignore-types';
import {LintContext, ProtectedRanges} from './utils/protected-ranges';
import {LinterSettings} from './settings-data';
import {App} from 'obsidian';
import {YAMLParseError} from 'yaml';
import LinterPlugin from './main';

export type Options = object;

type ApplyFunction = (text: string, options?: Options, protectedRanges?: ProtectedRanges) => string;

export enum RuleType {
  YAML = 'YAML',
  HEADING = 'Heading',
  FOOTNOTE = 'Footnote',
  CONTENT = 'Content',
  SPACING = 'Spacing',
  PASTE = 'Paste',
}

/** Class representing a rule */
export class Rule {
  private ruleHeading: string;

  /**
   * Create a rule
   * @param {LanguageStringKey} nameKey - The name key of the rule
   * @param {LanguageStringKey} descriptionKey - The description key of the rule
   * @param {string} settingsKey - The settings key of the rule
   * @param {string} alias - The alias of the rule which also is the config key for the rule
   * @param {RuleType} type - The type of the rule
   * @param {ApplyFunction} applyAfterIgnore - The function to apply the rule once everything has been ignored
   * @param {Array<Example>} examples - The examples to be displayed in the documentation
   * @param {Array<Option>} [options=[]] - The options of the rule to be displayed in the documentation
   * @param {boolean} [hasSpecialExecutionOrder=false] - The rule has special execution order
   * @param {IgnoreType[]} [ignoreTypes=[]] - The types of elements to ignore for the rule
   * @param {function(boolean):boolean} [disableConflictingOptions=null] - The function to disable conflicting rules or options when it is enabled
   */
  constructor(
      private nameKey: LanguageStringKey,
      private descriptionKey: LanguageStringKey,
      public settingsKey: string,
      public alias: string,
      public type: RuleType,
      public applyAfterIgnore: ApplyFunction,
      public examples: Array<Example>,
      public options: Array<Option> = [],
      public readonly hasSpecialExecutionOrder: boolean = false,
      public readonly ignoreTypes: IgnoreType[] = [],
      public readonly usesProtectedRanges: boolean = false,
      disableConflictingOptions: (value: boolean, app: App, plugin: LinterPlugin) => void = null,
  ) {
    this.ruleHeading = this.getName().toLowerCase().replaceAll(' ', '-');

    const onChange = disableConflictingOptions ? (value: boolean, app: App, plugin: LinterPlugin) => {
      if (value) {
        disableConflictingOptions(value, app, plugin);
      }
    }: undefined;

    options.unshift(new BooleanOption('enabled', this.descriptionKey, '' as LanguageStringKey, false, alias, onChange));
    for (const option of options) {
      option.ruleAlias = alias;
    }
  }

  public getDefaultOptions() {
    const options: { [optionName: string]: unknown } = {};

    for (const option of this.options) {
      options[option.configKey] = option.defaultValue;
    }

    return options;
  }

  public getOptions(settings: LinterSettings) {
    return settings.ruleConfigs[this.settingsKey];
  }

  public getName(): string {
    return getTextInLanguage(this.nameKey);
  }

  public getDescription(): string {
    return getTextInLanguage(this.descriptionKey);
  }

  public getURL(): string {
    return 'https://platers.github.io/obsidian-linter/settings/' + this.type.toLowerCase() + '-rules/#' + this.ruleHeading;
  }

  public enabledOptionName(): string {
    return this.options[0].configKey;
  }

  public runEnabledSideEffect(value: boolean, app: App, plugin: LinterPlugin): void {
    const enabled = this.options[0] as BooleanOption;
    enabled.onChange?.(value, app, plugin);
  }

  /**
   * Runs the rule, keeping it away from the parts of the document it declared it ignores.
   *
   * A rule that has been moved onto the protected range contract is given the document itself and
   * told which regions of it not to change. Every other rule is given a copy of the document with
   * those regions replaced by placeholders, which is what the linter used to do for all of them.
   * @param {string} text The document to run the rule over
   * @param {Options} [options] The rule's settings
   * @param {LintContext} [context] The shared view of this document, if one has been built
   * @return {string} The document after the rule
   */
  public apply(text: string, options?: Options, context?: LintContext): string {
    if (this.usesProtectedRanges) {
      // a context belongs to the text it was built from, so one for a different document is not
      // reused rather than trusted
      const contextForText = context && context.text === text ? context : LintContext.for(text);

      return this.applyAfterIgnore(text, options, contextForText.protectedRangesFor(this.ignoreTypes));
    }

    return ignoreListOfTypes(this.ignoreTypes, text, (textAfterIgnore: string) => {
      return this.applyAfterIgnore(textAfterIgnore, options);
    });
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

export const RuleTypeOrder = Object.values(RuleType);

/**
 * Returns a list of ignored rules in the YAML frontmatter of the text.
 * @param {string} text The text to parse
 * @return {[string[], boolean]} The list of ignored rules and whether the current file should be ignored entirely
 */
export function getDisabledRules(text: string): [string[], boolean] {
  const yaml_text = getYAMLText(text);
  if (yaml_text === null) {
    return [[], false];
  }

  const disabled_rules = getExactDisabledRuleValue(yaml_text);

  if (disabled_rules.includes('all')) {
    return [rules.map((rule) => rule.alias), true];
  }

  return [disabled_rules, false];
}

export const rules: Rule[] = [];

export const rulesDict = {} as Record<string, Rule>;
export const ruleTypeToRules = new Map<RuleType, Rule[]>;

export function registerRule(rule: Rule): void {
  rules.push(rule);
  rulesDict[rule.alias] = rule;

  if (ruleTypeToRules.has(rule.type)) {
    ruleTypeToRules.get(rule.type).push(rule);
  } else {
    ruleTypeToRules.set(rule.type, [rule]);
  }
}

export function sortRules(): void {
  rules.sort((a, b) => (RuleTypeOrder.indexOf(a.type) - RuleTypeOrder.indexOf(b.type)) || (a.settingsKey.localeCompare(b.settingsKey)));
}

export function wrapLintError(error: Error, ruleName: string) {
  let errorMessage: string;
  if (error instanceof YAMLParseError) {
    errorMessage = error.toString();
    errorMessage = getTextInLanguage('logs.wrapper-yaml-error').replace('{ERROR_MESSAGE}', errorMessage.substring(errorMessage.indexOf(':') + 1));
  } else {
    errorMessage = getTextInLanguage('logs.wrapper-unknown-error').replace('{ERROR_MESSAGE}', error.message);
  }

  // TODO: clean this up, and see about replacing encountered an with the appropriate getTextInLanguage
  throw new LinterError(`"${ruleName}" encountered an ${errorMessage}`, error);
}
