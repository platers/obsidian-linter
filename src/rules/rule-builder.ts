import {Example, Options, Rule, RuleType, registerRule, wrapLintError} from '../rules';
import {BooleanOption, DropdownOption, DropdownRecord, MdFilePickerOption, MomentFormatOption, Option, TextAreaOption, TextOption} from '../option';
import {logDebug, timingBegin, timingEnd} from '../utils/logger';
import {getTextInLanguage, LanguageStringKey} from '../lang/helpers';
import {IgnoreType, IgnoreTypes} from '../utils/ignore-types';
import {LinterSettings} from 'src/settings-data';
import {App} from 'obsidian';

// limit the amount of text that can be written to the logs to try to prevent memory issues
const maxFileSizeLength = 10000;

export abstract class RuleBuilderBase {
  static #ruleMap = new Map<string, Rule>();
  static #ruleBuilderMap = new Map<string, RuleBuilderBase>();
  static #noSettingsControlMap = new Map<string, string[]>();

  static getRule<TOptions extends Options>(this: (new() => RuleBuilder<TOptions>)): Rule {
    if (!RuleBuilderBase.#ruleMap.has(this.name)) {
      const builder = new this();
      const rule = new Rule(builder.nameKey, builder.descriptionKey, builder.settingsKey, builder.alias, builder.type, builder.safeApply.bind(builder), builder.exampleBuilders.map((b) => b.example), builder.optionBuilders.map((b) => b.option), builder.hasSpecialExecutionOrder, builder.ignoreTypes, builder.disableConflictingOptions);
      RuleBuilderBase.#ruleMap.set(this.name, rule);
      RuleBuilderBase.#ruleBuilderMap.set(builder.alias, builder);
    }

    return RuleBuilderBase.#ruleMap.get(this.name);
  }

  static applyIfEnabledBase(rule: Rule, text: string, settings: LinterSettings, extraOptions: Options): [result: string, isEnabled: boolean] {
    const optionsFromSettings = rule.getOptions(settings);
    if (optionsFromSettings[rule.enabledOptionName()]) {
      timingBegin(rule.alias);
      const options = Object.assign({}, optionsFromSettings, extraOptions) as Options;
      logDebug(`${getTextInLanguage('logs.run-rule-text')} ${rule.getName()}`);

      try {
        const newText = rule.apply(text, options);
        timingEnd(rule.alias);

        if (newText.length > maxFileSizeLength) {
          logDebug(newText.slice(0, maxFileSizeLength -1) + '...');
        } else {
          logDebug(newText);
        }

        return [newText, true];
      } catch (error) {
        timingEnd(rule.alias);
        wrapLintError(error, rule.getName());
      }
    } else {
      return [text, false];
    }
  }

  static getBuilderByName(name: string): RuleBuilderBase {
    return RuleBuilderBase.#ruleBuilderMap.get(name);
  }

  protected static setNoSettingControl(optionsClassName: string, propertyKey: string) {
    if (!RuleBuilderBase.#noSettingsControlMap.has(optionsClassName)) {
      RuleBuilderBase.#noSettingsControlMap.set(optionsClassName, []);
    }
    RuleBuilderBase.#noSettingsControlMap.get(optionsClassName).push(propertyKey);
  }

  static hasSettingControl(optionsClassName: string, optionsClassKey: string) {
    return !RuleBuilderBase.#noSettingsControlMap.has(optionsClassName) || !RuleBuilderBase.#noSettingsControlMap.get(optionsClassName).includes(optionsClassKey);
  }
}

type RuleBuilderConstructorArgs = {
  nameKey: LanguageStringKey,
  descriptionKey: LanguageStringKey,
  type: RuleType,
  hasSpecialExecutionOrder?: boolean,
  // ignore types to use on the entirety of the rule and not just a part
  // Note: this value should not contain custom ignore as that is added to all rules except Paste rules which do not use this property
  ruleIgnoreTypes?: IgnoreType[],
  disableConflictingOptions?: (value: boolean, app: App) => void,
};

export default abstract class RuleBuilder<TOptions extends Options> extends RuleBuilderBase {
  public settingsKey: string;
  public alias: string;
  public nameKey: LanguageStringKey;
  public descriptionKey: LanguageStringKey;
  public type: RuleType;
  public hasSpecialExecutionOrder: boolean;
  public ignoreTypes: IgnoreType[];
  public disableConflictingOptions: (value: boolean, app: App) => void;
  constructor(args: RuleBuilderConstructorArgs) {
    super();

    // cut "rules." from the start and ".name" from the end
    this.alias = args.nameKey.substring(6, args.nameKey.length-5);
    this.settingsKey = this.alias;
    this.nameKey = args.nameKey;
    this.descriptionKey = args.descriptionKey;
    this.type = args.type;
    this.hasSpecialExecutionOrder = args.hasSpecialExecutionOrder ?? false;
    this.disableConflictingOptions = args.disableConflictingOptions ?? null;

    if (args.ruleIgnoreTypes) {
      this.ignoreTypes = [IgnoreTypes.customIgnore, ...args.ruleIgnoreTypes];
    } else {
      this.ignoreTypes = [IgnoreTypes.customIgnore];
    }
  }

  abstract get OptionsClass(): (new() => TOptions);

  static register<TOptions extends Options>(RuleBuilderClass: typeof RuleBuilderBase & (new() => RuleBuilder<TOptions>)): void {
    const rule = RuleBuilderClass.getRule();
    registerRule(rule);
  }

  safeApply(text: string, options?: Options): string {
    return this.apply(text, this.buildRuleOptions(options));
  }

  buildRuleOptions(options?: Options): TOptions {
    options = options ?? {};
    const defaultOptions = new this.OptionsClass();
    const ruleOptions = Object.assign(defaultOptions, options) as TOptions;

    for (const optionBuilder of this.optionBuilders) {
      optionBuilder.setRuleOption(ruleOptions, options);
    }

    return ruleOptions;
  }

  abstract apply(text: string, options: TOptions): string;
  abstract get exampleBuilders(): ExampleBuilder<TOptions>[];
  abstract get optionBuilders(): OptionBuilderBase<TOptions>[];

  static applyIfEnabled<TOptions extends Options>(this: typeof RuleBuilderBase & (new() => RuleBuilder<TOptions>), text: string, settings: LinterSettings, disabledRules: string[], extraOptions?: TOptions): [result: string, isEnabled: boolean] {
    const rule = this.getRule();
    if (disabledRules.includes(rule.alias)) {
      logDebug(rule.alias + ' ' + getTextInLanguage('logs.disabled-text'));
      return [text, false];
    }

    return RuleBuilderBase.applyIfEnabledBase(rule, text, settings, extraOptions);
  }

  static getRuleOptions<TOptions extends Options>(this: (new() => RuleBuilder<TOptions>), settings: LinterSettings): TOptions {
    const rule = RuleBuilderBase.getRule.bind(this)();
    const builder = new this();
    const optionsFromSettings = rule.getOptions(settings);
    return builder.buildRuleOptions(optionsFromSettings);
  }

  static noSettingControl() {
    return (target: Object, propertyKey: string) => {
      const optionsClassName = target.constructor.name;
      RuleBuilderBase.setNoSettingControl(optionsClassName, propertyKey);
    };
  }
}

export class ExampleBuilder<TOptions extends Options> {
  readonly example: Example;

  // HACK to bypass the Typescript generics system flaw
  // https://github.com/microsoft/TypeScript/wiki/FAQ#why-is-astring-assignable-to-anumber-for-interface-at--
  // eslint-disable-next-line no-unused-private-class-members
  #_: TOptions;

  constructor(args: {
    description: string,
    before: string,
    after: string,
    options?: TOptions
  }) {
    this.example = new Example(args.description, args.before, args.after, args.options);
  }
}

type KeysOfObjectMatchingPropertyValueType<TObject, TValue> = {[TKey in keyof TObject]-?: TObject[TKey] extends TValue ? (TValue extends TObject[TKey] ? TKey : never) : never }[keyof TObject & string];

type OptionBuilderConstructorArgs<TOptions extends Options, TValue> = {
  OptionsClass: (new() => TOptions),
  nameKey: LanguageStringKey
  descriptionKey: LanguageStringKey,
  optionsKey: KeysOfObjectMatchingPropertyValueType<TOptions, TValue>;
};

export abstract class OptionBuilderBase<TOptions extends Options> {
  abstract setRuleOption(ruleOptions: TOptions, options: Options): void;
  abstract get option(): Option;
}

export abstract class OptionBuilder<TOptions extends Options, TValue> {
  readonly OptionsClass: (new() => TOptions);
  readonly configKey: string;
  readonly nameKey: LanguageStringKey;
  readonly descriptionKey: LanguageStringKey;
  readonly optionsKey: KeysOfObjectMatchingPropertyValueType<TOptions, TValue>;
  #option: Option;

  constructor(args: OptionBuilderConstructorArgs<TOptions, TValue>) {
    this.OptionsClass = args.OptionsClass;

    const keyParts = args.nameKey.split('.');
    if (keyParts.length == 1) {
      this.configKey = keyParts[0];
    } else {
      this.configKey = keyParts[keyParts.length - 2];
    }

    this.nameKey = args.nameKey;
    this.descriptionKey = args.descriptionKey;
    this.optionsKey = args.optionsKey;
  }

  protected get defaultValue(): TValue {
    return new this.OptionsClass()[this.optionsKey];
  }

  get option(): Option {
    if (!this.#option) {
      this.#option = this.buildOption();
    }

    return this.#option;
  }

  setRuleOption(ruleOptions: TOptions, options: Options) {
    // `as TValue` is not enough because of the https://github.com/microsoft/TypeScript/issues/48992
    const optionValue = options[this.configKey] as TOptions[KeysOfObjectMatchingPropertyValueType<TOptions, TValue>];
    if (optionValue !== undefined) {
      ruleOptions[this.optionsKey] = optionValue;
    }
  }

  protected abstract buildOption(): Option;
}

export class BooleanOptionBuilder<TOptions extends Options> extends OptionBuilder<TOptions, boolean> {
  onChange?: (value: boolean, app: App) => void;
  constructor(args: OptionBuilderConstructorArgs<TOptions, boolean> & {
    onChange?: (value: boolean, app: App) => void,
  }) {
    super(args);
    this.onChange = args.onChange ?? null;
  }

  protected buildOption(): Option {
    return new BooleanOption(this.configKey, this.nameKey, this.descriptionKey, this.defaultValue, null, this.onChange);
  }
}

export class NumberOptionBuilder<TOptions extends Options> extends OptionBuilder<TOptions, Number> {
  protected buildOption(): Option {
    return new TextOption(this.configKey, this.nameKey, this.descriptionKey, this.defaultValue);
  }
}

export class DropdownOptionBuilder<TOptions extends Options, TValue extends string> extends OptionBuilder<TOptions, TValue> {
  readonly records: DropdownRecord[];

  constructor(args: OptionBuilderConstructorArgs<TOptions, TValue> & {
    records: {
      value: TValue,
      description: string
    }[]
  }) {
    super(args);
    this.records = args.records.map((record) => new DropdownRecord('enums.' + record.value as LanguageStringKey, record.description));
  }

  protected buildOption(): Option {
    return new DropdownOption(this.configKey, this.nameKey, this.descriptionKey, this.defaultValue, this.records);
  }
}

export class TextAreaOptionBuilder<TOptions extends Options> extends OptionBuilder<TOptions, string[]> {
  separator: string;
  splitter: RegExp;
  constructor(args: OptionBuilderConstructorArgs<TOptions, string[]> & {
    separator?: string,
    splitter?: RegExp
  }) {
    super(args);
    this.separator = args.separator ?? '\n';
    this.splitter = args.splitter ?? /\n/;
  }


  protected buildOption(): Option {
    return new TextAreaOption(this.configKey, this.nameKey, this.descriptionKey, this.defaultValue.join(this.separator));
  }

  setRuleOption(ruleOptions: TOptions, options: Options) {
    if (options[this.configKey] !== undefined) {
      // `as string[]` is not enough because of the https://github.com/microsoft/TypeScript/issues/48992
      // make sure to remove any empty strings as well as they are not valid values
      const optionValue = ((options[this.configKey] as string).split(this.splitter) as TOptions[KeysOfObjectMatchingPropertyValueType<TOptions, string[]>]).filter(function(el: string) {
        return el != '';
      });
      ruleOptions[this.optionsKey] = optionValue;
    }
  }
}

export class TextOptionBuilder<TOptions extends Options> extends OptionBuilder<TOptions, string> {
  protected buildOption(): Option {
    return new TextOption(this.configKey, this.nameKey, this.descriptionKey, this.defaultValue);
  }
}

export class MomentFormatOptionBuilder<TOptions extends Options> extends OptionBuilder<TOptions, string> {
  protected buildOption(): Option {
    return new MomentFormatOption(this.configKey, this.nameKey, this.descriptionKey, this.defaultValue);
  }
}

export class MdFilePickerOptionBuilder<TOptions extends Options> extends OptionBuilder<TOptions, string[]> {
  protected buildOption(): Option {
    return new MdFilePickerOption(this.configKey, this.nameKey, this.descriptionKey);
  }
}
