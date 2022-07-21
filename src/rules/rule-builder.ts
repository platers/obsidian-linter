import {Example, Options, Rule, RuleType, registerRule} from '../rules';
import {BooleanOption, DropdownOption, DropdownRecord, Option, TextOption} from '../option';

export abstract class RuleBuilderBase {
  static #ruleMap = new Map<string, Rule>();

  static getRule<TOptions extends Options>(this: (new() => RuleBuilder<TOptions>)): Rule {
    if (!RuleBuilderBase.#ruleMap.has(this.name)) {
      const builder = new this();
      const rule = new Rule(builder.name, builder.description, builder.type, builder.safeApply.bind(builder), builder.exampleBuilders.map((b) => b.example), builder.optionBuilders.map((b) => b.option));
      RuleBuilderBase.#ruleMap.set(this.name, rule);
    }

    return RuleBuilderBase.#ruleMap.get(this.name);
  }

  static register<TOptions extends Options>(RuleBuilderClass: typeof RuleBuilderBase & (new() => RuleBuilder<TOptions>)): void {
    const rule = RuleBuilderClass.getRule();
    registerRule(rule);
  }
}

export default abstract class RuleBuilder<TOptions extends Options> extends RuleBuilderBase {
  abstract get OptionsClass(): (new() => TOptions);

  safeApply(text: string, options?: Options): string {
    options = options ?? {};
    const defaultOptions = new this.OptionsClass();
    const ruleOptions = Object.assign(defaultOptions, options) as TOptions;

    for (const optionBuilder of this.optionBuilders) {
      const optionsKey = optionBuilder.optionsKey as keyof TOptions;
      if (ruleOptions[optionsKey] === undefined) {
        ruleOptions[optionsKey] = options[optionBuilder.name];
      }
    }
    return this.apply(text, ruleOptions);
  }

  abstract get name(): string;
  abstract get description(): string;
  abstract get type(): RuleType;
  abstract apply(text: string, options: TOptions): string;
  abstract get exampleBuilders(): ExampleBuilder<TOptions>[];
  abstract get optionBuilders(): OptionBuilder<TOptions, any>[];
}

export class ExampleBuilder<TOptions extends Options> {
  readonly example: Example;

  // HACK to bypass the Typescript generics system flaw
  // https://github.com/microsoft/TypeScript/wiki/FAQ#why-is-astring-assignable-to-anumber-for-interface-at--
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

type KeysOfObjectMatchingPropertyValueType<TObject, TValue> = string & {[TKey in keyof TObject]-?: TObject[TKey] extends TValue ? TKey : never}[keyof TObject];

type OptionBuilderConstructorArgs<TOptions extends Options, TValue> = {
  OptionsClass: (new() => TOptions),
  name: string
  description: string,
  optionsKey: KeysOfObjectMatchingPropertyValueType<TOptions, TValue>;
};

export abstract class OptionBuilder<TOptions extends Options, TValue> {
  readonly OptionsClass: (new() => TOptions);
  readonly name: string;
  readonly description: string;
  readonly optionsKey: KeysOfObjectMatchingPropertyValueType<TOptions, TValue>;
  #option: Option;

  constructor(args: OptionBuilderConstructorArgs<TOptions, TValue>) {
    this.OptionsClass = args.OptionsClass;
    this.name = args.name;
    this.description = args.description;
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

  protected abstract buildOption(): Option;
}

export class BooleanOptionBuilder<TOptions extends Options> extends OptionBuilder<TOptions, boolean> {
  protected buildOption(): Option {
    return new BooleanOption(this.name, this.description, this.defaultValue);
  }
}

export class NumberOptionBuilder<TOptions extends Options> extends OptionBuilder<TOptions, Number> {
  protected buildOption(): Option {
    return new TextOption(this.name, this.description, this.defaultValue);
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
    this.records = args.records.map((record) => new DropdownRecord(record.value, record.description));
  }

  protected buildOption(): Option {
    return new DropdownOption(this.name, this.description, this.defaultValue, this.records);
  }
}
