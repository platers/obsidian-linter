import LinterPlugin from './main';
import {LinterSettings} from './rules';

/** Class representing an option of a rule */

export class Option {
  public name: string;
  public description: string;
  public ruleName: string;
  public defaultValue: any;

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
}

export class TextOption extends Option {
  public defaultValue: string;
}

export class MomentFormatOption extends Option {
  public defaultValue: boolean;
}
