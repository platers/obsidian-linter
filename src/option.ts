import {App, ExtraButtonComponent, normalizePath, Setting, TFile, ToggleComponent} from 'obsidian';
import type {SettingDefinition, SettingDefinitionGroup, SettingDefinitionItem, SettingDefinitionPage} from 'obsidian';
import {getTextInLanguage, LanguageStringKey} from './lang/helpers';
import LinterPlugin from './main';
import {hideEl, unhideEl, setElContent} from './ui/helpers';
import {LinterSettings} from './settings-data';
import {AutoCorrectFilesPickerOption, CustomAutoCorrectContent} from './ui/linter-components/auto-correct-files-picker-option';
import MdFileSuggester from './ui/suggesters/md-file-suggester';
import {ParseResultsModal} from './ui/modals/parse-results-modal';
import {parseCustomReplacements, stripCr} from './utils/strings';

export type SearchOptionInfo = {name: string, description: string, options?: DropdownRecord[]}

function getFileFromPath(app: App, filePath: string): TFile | null {
  const file = app.vault.getAbstractFileByPath(normalizePath(filePath));
  if (file instanceof TFile) {
    return file;
  }
  return null;
}

/** Class representing an option of a rule */

export abstract class Option {
  public ruleAlias: string;
  protected setting: Setting;

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

  public abstract getSettingDefinition(plugin: LinterPlugin, update: () => void): SettingDefinitionItem;

  protected setOption(value: any, settings: LinterSettings): void {
    settings.ruleConfigs[this.ruleAlias][this.configKey] = value;
  }

  protected getCurrentValue(plugin: LinterPlugin): any {
    return plugin.settings.ruleConfigs[this.ruleAlias]?.[this.configKey] ?? this.defaultValue;
  }

  protected async writeAndSave(value: any, plugin: LinterPlugin): Promise<void> {
    plugin.settings.ruleConfigs[this.ruleAlias][this.configKey] = value;
    await plugin.saveSettings();
  }

  protected parseNameAndDescriptionAndRemoveSettingBorder() {
    setElContent(this.getName(), this.setting.nameEl);
    setElContent(this.getDescription(), this.setting.descEl);

    this.setting.settingEl.addClass('linter-no-border');
    this.setting.descEl.addClass('linter-no-padding-top');
  }

  hide() {
    if (this.setting) hideEl(this.setting.settingEl);
  }

  unhide() {
    if (this.setting) unhideEl(this.setting.settingEl);
  }
}

export class BooleanOption extends Option {
  public defaultValue: boolean;
  private toggleComponent: ToggleComponent;

  constructor(configKey: string, nameKey: LanguageStringKey, descriptionKey: LanguageStringKey, defaultValue: any, ruleAlias?: string | null, private onChange?: (value: boolean, app: App) => void) {
    super(configKey, nameKey, descriptionKey, defaultValue, ruleAlias);
  }

  public display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
    this.setting = new Setting(containerEl)
        .addToggle((toggle) => {
          this.toggleComponent = toggle;

          toggle.setValue(settings.ruleConfigs[this.ruleAlias][this.configKey]);
          toggle.onChange((value) => {
            this.setOption(value, settings);
            plugin.settings = settings;

            if (this.onChange) {
              this.onChange(value, plugin.app);
            }

            void plugin.saveSettings();
          });
        });

    this.parseNameAndDescriptionAndRemoveSettingBorder();
  }

  public getSettingDefinition(plugin: LinterPlugin, _update: () => void): SettingDefinitionItem {
    return {
      name: this.getName(),
      desc: this.getDescription(),
      render: (setting) => {
        setting.addToggle((toggle) => toggle
            .setValue(this.getCurrentValue(plugin))
            .onChange(async (value) => {
              await this.writeAndSave(value, plugin);
              if (this.onChange) {
                this.onChange(value, plugin.app);
              }
            }));
      },
    };
  }

  getValue(): boolean {
    return this.toggleComponent.getValue();
  }

  setValue(value: boolean) {
    this.toggleComponent.setValue(value);
  }
}

export class TextOption extends Option {
  public defaultValue: string;

  public display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
    this.setting = new Setting(containerEl)
        .addText((textbox) => {
          textbox.setValue(settings.ruleConfigs[this.ruleAlias][this.configKey]);
          textbox.onChange((value) => {
            this.setOption(value, settings);
            plugin.settings = settings;
            void plugin.saveSettings();
          });
        });

    this.parseNameAndDescriptionAndRemoveSettingBorder();
  }

  public getSettingDefinition(plugin: LinterPlugin, _update: () => void): SettingDefinitionItem {
    return {
      name: this.getName(),
      desc: this.getDescription(),
      render: (setting) => {
        setting.addText((textbox) => textbox
            .setValue(this.getCurrentValue(plugin) ?? '')
            .onChange(async (value) => {
              await this.writeAndSave(value, plugin);
            }));
      },
    };
  }
}

export class TextAreaOption extends Option {
  public defaultValue: string;

  public display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
    this.setting = new Setting(containerEl)
        .addTextArea((textbox) => {
          textbox.setValue(settings.ruleConfigs[this.ruleAlias][this.configKey]);
          textbox.onChange((value) => {
            this.setOption(value, settings);
            plugin.settings = settings;
            void plugin.saveSettings();
          });
        });

    this.parseNameAndDescriptionAndRemoveSettingBorder();
  }

  public getSettingDefinition(plugin: LinterPlugin, _update: () => void): SettingDefinitionItem {
    return {
      name: this.getName(),
      desc: this.getDescription(),
      render: (setting) => {
        setting.addTextArea((textbox) => textbox
            .setValue(this.getCurrentValue(plugin) ?? '')
            .onChange(async (value) => {
              await this.writeAndSave(value, plugin);
            }));
      },
    };
  }
}

export class MomentFormatOption extends Option {
  public defaultValue: boolean;

  public display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
    this.setting = new Setting(containerEl)
        .addMomentFormat((format) => {
          format.setValue(settings.ruleConfigs[this.ruleAlias][this.configKey]);
          format.setPlaceholder('dddd, MMMM Do YYYY, h:mm:ss a');
          format.onChange((value) => {
            this.setOption(value, settings);
            plugin.settings = settings;
            void plugin.saveSettings();
          });
        });

    this.parseNameAndDescriptionAndRemoveSettingBorder();
  }

  public getSettingDefinition(plugin: LinterPlugin, _update: () => void): SettingDefinitionItem {
    return {
      name: this.getName(),
      desc: this.getDescription(),
      render: (setting) => {
        setting.addMomentFormat((format) => format
            .setPlaceholder('dddd, MMMM Do YYYY, h:mm:ss a')
            .setValue(this.getCurrentValue(plugin) ?? '')
            .onChange(async (value) => {
              await this.writeAndSave(value, plugin);
            }));
      },
    };
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
    this.setting = new Setting(containerEl)
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

    this.parseNameAndDescriptionAndRemoveSettingBorder();
  }

  public getSettingDefinition(plugin: LinterPlugin, _update: () => void): SettingDefinitionItem {
    return {
      name: this.getName(),
      desc: this.getDescription(),
      render: (setting) => {
        setting.addDropdown((dropdown) => {
          for (const option of this.options) {
            dropdown.addOption(option.value.replace('enums.', ''), option.getDisplayValue());
          }
          dropdown.setValue(this.getCurrentValue(plugin) ?? this.defaultValue);
          dropdown.onChange(async (value) => {
            await this.writeAndSave(value, plugin);
          });
        });
      },
    };
  }
}


export class MdFilePickerOption extends Option {
  private settingEl: HTMLDivElement;
  constructor(configKey: string, nameKey: LanguageStringKey, descriptionKey: LanguageStringKey, ruleAlias?: string | null) {
    super(configKey, nameKey, descriptionKey, [], ruleAlias);
  }

  public display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
    settings.ruleConfigs[this.ruleAlias][this.configKey] = settings.ruleConfigs[this.ruleAlias][this.configKey] ?? [];

    this.settingEl = containerEl.createDiv();

    new AutoCorrectFilesPickerOption(this.settingEl, settings.ruleConfigs[this.ruleAlias][this.configKey], plugin.app, () => {
      void plugin.saveSettings();
    }, this.nameKey, this.descriptionKey);
  }

  public getSettingDefinition(plugin: LinterPlugin, update: () => void): SettingDefinitionItem {
    plugin.settings.ruleConfigs[this.ruleAlias][this.configKey] =
        plugin.settings.ruleConfigs[this.ruleAlias][this.configKey] ?? [];
    const filesPicked: CustomAutoCorrectContent[] = plugin.settings.ruleConfigs[this.ruleAlias][this.configKey];
    const app = plugin.app;
    const ruleName = getTextInLanguage('rules.auto-correct-common-misspellings.name');
    const warning = getTextInLanguage('options.custom-auto-correct.warning-text').replace('{NAME}', ruleName);

    const heading = warning ? `${this.getName()} — ${warning}` : this.getName();

    const fileRows: SettingDefinition[] = filesPicked.map((pickedFile, index) => ({
      name: pickedFile.filePath || getTextInLanguage('options.custom-auto-correct.file-search-placeholder-text'),
      searchable: false,
      render: (setting) => {
        const selectedFiles = filesPicked.map((f) => f.filePath);
        let infoButton: ExtraButtonComponent;
        setting.addSearch((cb) => {
          new MdFileSuggester(app, cb.inputEl, selectedFiles);
          cb.setPlaceholder(getTextInLanguage('options.custom-auto-correct.file-search-placeholder-text'))
              .setValue(pickedFile.filePath)
              .onChange(async (newPath) => {
                if (newPath === '' || newPath === cb.inputEl.getAttribute('fileName')) {
                  const file = getFileFromPath(app, newPath);
                  pickedFile.filePath = newPath;
                  if (file) {
                    pickedFile.customReplacements = parseCustomReplacements(stripCr(await app.vault.read(file)));
                    infoButton.setDisabled(false);
                    infoButton.extraSettingsEl.addClass('clickable-icon');
                  } else {
                    pickedFile.customReplacements = null;
                    infoButton.setDisabled(true);
                    infoButton.extraSettingsEl.removeClass('clickable-icon');
                  }
                  filesPicked[index] = pickedFile;
                  await plugin.saveSettings();
                }
              });
        });
        setting.addExtraButton((cb) => {
          infoButton = cb;
          cb.setIcon('info')
              .setTooltip(getTextInLanguage('options.custom-auto-correct.show-parsed-contents-tooltip'))
              .onClick(() => {
                new ParseResultsModal(app, pickedFile).open();
              });
          if (pickedFile.filePath === '') {
            cb.setDisabled(true);
            cb.extraSettingsEl.removeClass('clickable-icon');
          }
        });
      },
    }));

    const group: SettingDefinitionGroup = {
      type: 'group',
      cls: 'mod-list',
      heading,
      extraButtons: [
        (btn) => btn
            .setIcon('plus-with-circle')
            .setTooltip(getTextInLanguage('options.custom-auto-correct.add-new-replacement-file-tooltip'))
            .onClick(async () => {
              filesPicked.push({filePath: '', customReplacements: null});
              await plugin.saveSettings();
              update();
            }),
        (btn) => btn
            .setIcon('refresh-cw')
            .setTooltip(getTextInLanguage('options.custom-auto-correct.refresh-tooltip-text'))
            .onClick(async () => {
              for (const replacementFileInfo of filesPicked) {
                if (replacementFileInfo.filePath !== '') {
                  const file = getFileFromPath(app, replacementFileInfo.filePath);
                  if (file) {
                    replacementFileInfo.customReplacements = parseCustomReplacements(stripCr(await app.vault.cachedRead(file)));
                  }
                }
              }
              await plugin.saveSettings();
            }),
      ],
      onDelete: async (index) => {
        filesPicked.splice(index, 1);
        await plugin.saveSettings();
        update();
      },
      items: fileRows,
    };

    const page: SettingDefinitionPage = {
      type: 'page',
      name: this.getName(),
      desc: warning,
      items: [group],
    };
    return page;
  }

  override hide() {
    if (this.settingEl) hideEl(this.settingEl);
  }

  override unhide() {
    if (this.settingEl) unhideEl(this.settingEl);
  }
}
