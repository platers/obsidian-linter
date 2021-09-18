import { Setting } from 'obsidian';
import LinterPlugin from './main';
import { LinterSettings } from './rules';

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
   * @param {string} ruleName - The name of the rule this option belongs to
   * @param {any} defaultValue - The default value of the option
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

  public display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
    new Setting(containerEl)
      .setName(this.name)
      .setDesc(this.description)
      .addToggle((toggle) => {
        toggle.setValue(settings.ruleConfigs[this.ruleName][this.name]);
        toggle.onChange((value) => {
          this.setOption(value, settings);
          plugin.settings = settings;
          plugin.saveData(plugin.settings);
        });
      });
  }
}


export class MomentFormatOption extends Option {
  public defaultValue: boolean;

  public display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
    new Setting(containerEl)
      .setName(this.name)
      .setDesc(this.description)
      .addMomentFormat((format) => {
        format.setValue(settings.ruleConfigs[this.ruleName][this.name]);
        format.onChange((value) => {
          this.setOption(value, settings);
          plugin.settings = settings;
          plugin.saveData(plugin.settings);
        });
      });
  }
}
