import LinterPlugin from './main';
import {LinterSettings, Options} from './rules';

/** Class representing an option of a rule */

export class Option {
  public name: string;
  public description: string;
  public ruleName: string;
  public defaultValue: any;
  public optionsKey: any;

  /**
   * Create an option
   * @param {string} name - The name of the option
   * @param {string} description - The description of the option
   * @param {any} defaultValue - The default value of the option
   * @param {string?} ruleName - The name of the rule this option belongs to
   */
  constructor(name: string, description: string, defaultValue: any, ruleName?: string | null) {
    this.name = name;
    this.description = description;
    this.defaultValue = defaultValue;

    if (ruleName) {
      this.ruleName = ruleName;
    }
  }

  public display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
    throw new Error('Not implemented');
  }

  protected setOption(value: any, settings: LinterSettings): void {
    settings.ruleConfigs[this.ruleName][this.name] = value;
  }
}

export class BooleanOption extends Option {
  public defaultValue: boolean;

  static create<TOptions extends Options>(args: {
    optionsClass: (new() => TOptions),
    name: string,
    description: string,
    optionsKey: keyof TOptions
  }) : BooleanOption {
    const defaultOptions = new args.optionsClass(); // eslint-disable-line new-cap
    const result = new BooleanOption(args.name, args.description, defaultOptions[args.optionsKey]);
    result.optionsKey = args.optionsKey;
    return result;
  }
}

export class TextOption extends Option {
  public defaultValue: string;
}

export class TextAreaOption extends Option {
  public defaultValue: string;
}

export class MomentFormatOption extends Option {
  public defaultValue: boolean;
}

export class DropdownRecord {
  public value: string;
  public description: string;

  constructor(value: string, description: string) {
    this.value = value;
    this.description = description;
  }
}

export class DropdownOption extends Option {
  public defaultValue: string;
  public options: DropdownRecord[];

  constructor(name: string, description: string, defaultValue: string, options: DropdownRecord[], ruleName?: string | null) {
    super(name, description, defaultValue, ruleName);
    this.options = options;
  }
}
