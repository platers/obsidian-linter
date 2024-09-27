import {Setting} from 'obsidian';
import {getTextInLanguage, LanguageStringKey} from './lang/helpers';
import LinterPlugin from './main';
import {parseTextToHTMLWithoutOuterParagraph} from './ui/helpers';
import {LinterSettings} from './settings-data';
import {AutoCorrectFilesPickerOption} from './ui/linter-components/auto-correct-files-picker-option';

export type SearchOptionInfo = {name: string, description: string, options?: DropdownRecord[]}

/** Class representing an option of a rule */

export abstract class Option {
  public ruleAlias: string;

  /**
   * Create an option
   * @param {LanguageStringKey} nameKey - The name key of the option
   * @param {LanguageStringKey} descriptionKey - The description key of the option
   * @param {any} defaultValue - The default value of the option
   * @param {string?} ruleAlias - The alias of the rule this option belongs to
   */
  constructor(public configKey: string, public nameKey: LanguageStringKey, public descriptionKey: LanguageStringKey, public defaultValue: any, ruleAlias?: string | null) {
    if (ruleAlias) {
      this.ruleAlias = ruleAlias;
    }
  }

  public getName(): string {
    return getTextInLanguage(this.nameKey) ?? '';
  }

  public getDescription(): string {
    return getTextInLanguage(this.descriptionKey) ?? '';
  }

  public getSearchInfo(): SearchOptionInfo {
    return {name: this.getName(), description: this.getDescription()};
  }

  public abstract display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void;

  protected setOption(value: any, settings: LinterSettings): void {
    settings.ruleConfigs[this.ruleAlias][this.configKey] = value;
  }

  protected parseNameAndDescriptionAndRemoveSettingBorder(setting: Setting, plugin: LinterPlugin) {
    parseTextToHTMLWithoutOuterParagraph(plugin.app, this.getName(), setting.nameEl, plugin.settingsTab.component);
    parseTextToHTMLWithoutOuterParagraph(plugin.app, this.getDescription(), setting.descEl, plugin.settingsTab.component);

    setting.settingEl.addClass('linter-no-border');
  }
}

export class BooleanOption extends Option {
  public defaultValue: boolean;

  public display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
    const setting = new Setting(containerEl)
        .addToggle((toggle) => {
          toggle.setValue(settings.ruleConfigs[this.ruleAlias][this.configKey]);
          toggle.onChange((value) => {
            this.setOption(value, settings);
            plugin.settings = settings;
            void plugin.saveSettings();
          });
        });

    this.parseNameAndDescriptionAndRemoveSettingBorder(setting, plugin);
  }
}

export class TextOption extends Option {
  public defaultValue: string;

  public display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
    const setting = new Setting(containerEl)
        .addText((textbox) => {
          textbox.setValue(settings.ruleConfigs[this.ruleAlias][this.configKey]);
          textbox.onChange((value) => {
            this.setOption(value, settings);
            plugin.settings = settings;
            void plugin.saveSettings();
          });
        });

    this.parseNameAndDescriptionAndRemoveSettingBorder(setting, plugin);
  }
}

export class TextAreaOption extends Option {
  public defaultValue: string;

  public display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
    const setting = new Setting(containerEl)
        .addTextArea((textbox) => {
          textbox.setValue(settings.ruleConfigs[this.ruleAlias][this.configKey]);
          textbox.onChange((value) => {
            this.setOption(value, settings);
            plugin.settings = settings;
            void plugin.saveSettings();
          });
        });

    this.parseNameAndDescriptionAndRemoveSettingBorder(setting, plugin);
  }
}

export class MomentFormatOption extends Option {
  public defaultValue: boolean;

  public display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
    const setting = new Setting(containerEl)
        .addMomentFormat((format) => {
          format.setValue(settings.ruleConfigs[this.ruleAlias][this.configKey]);
          format.setPlaceholder('dddd, MMMM Do YYYY, h:mm:ss a');
          format.onChange((value) => {
            this.setOption(value, settings);
            plugin.settings = settings;
            void plugin.saveSettings();
          });
        });

    this.parseNameAndDescriptionAndRemoveSettingBorder(setting, plugin);
  }
}

export class DropdownRecord {
  public value: LanguageStringKey;
  public description: string;

  constructor(value: LanguageStringKey, description: string) {
    this.value = value;
    this.description = description;
  }

  getDisplayValue(): string {
    return getTextInLanguage(this.value) ?? '';
  }
}

export class DropdownOption extends Option {
  public defaultValue: string;
  public options: DropdownRecord[];

  constructor(configKey: string, nameKey: LanguageStringKey, descriptionKey: LanguageStringKey, defaultValue: string, options: DropdownRecord[], ruleAlias?: string | null) {
    super(configKey, nameKey, descriptionKey, defaultValue, ruleAlias);
    this.options = options;
  }

  public getSearchInfo(): SearchOptionInfo {
    return {name: this.getName(), description: this.getDescription(), options: this.options};
  }

  public display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
    const setting = new Setting(containerEl)
        .addDropdown((dropdown) => {
          // First, add all the available options
          for (const option of this.options) {
            dropdown.addOption(option.value.replace('enums.', ''), option.getDisplayValue());
          }

          // Set currently selected value from existing settings
          dropdown.setValue(settings.ruleConfigs[this.ruleAlias][this.configKey]);

          dropdown.onChange((value) => {
            this.setOption(value, settings);
            plugin.settings = settings;
            void plugin.saveSettings();
          });
        });

    this.parseNameAndDescriptionAndRemoveSettingBorder(setting, plugin);
  }
}


export class MdFilePickerOption extends Option {
  constructor(configKey: string, nameKey: LanguageStringKey, descriptionKey: LanguageStringKey, ruleAlias?: string | null) {
    super(configKey, nameKey, descriptionKey, [], ruleAlias);
  }

  public display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
    settings.ruleConfigs[this.ruleAlias][this.configKey] = settings.ruleConfigs[this.ruleAlias][this.configKey] ?? [];

    new AutoCorrectFilesPickerOption(containerEl, plugin.settingsTab.component, settings.ruleConfigs[this.ruleAlias][this.configKey], plugin.app, () => {
      void plugin.saveSettings();
    }, this.nameKey, this.descriptionKey);
  }
}
