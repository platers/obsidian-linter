import {App, ExtraButtonComponent, normalizePath, TFile, ToggleComponent} from 'obsidian';
import type {SettingDefinition, SettingDefinitionItem, SettingDefinitionList, SettingDefinitionPage} from 'obsidian';
import {getTextInLanguage, LanguageStringKey} from './lang/helpers';
import LinterPlugin from './main';
import {richDescription} from './ui/helpers';
import {LinterSettings} from './settings-data';
import { CustomAutoCorrectContent } from './settings-data';
import MdFileSuggester from './ui/suggesters/md-file-suggester';
import {ParseResultsModal} from './ui/modals/parse-results-modal';
import {ListItemsModal, ListItemValidation} from './ui/modals/add-list-entry-modals'
import {parseCustomReplacements, stripCr} from './utils/strings';
import {LinterSettingsKeys} from './settings-data';

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

  /**
   * Create an option
   * @param {LanguageStringKey} nameKey - The name key of the option
   * @param {LanguageStringKey} descriptionKey - The description key of the option
   * @param {any} defaultValue - The default value of the option
   * @param {string?} ruleAlias - The alias of the rule this option belongs to
   */
  constructor(public configKey: string, public nameKey: LanguageStringKey, public descriptionKey: LanguageStringKey, public defaultValue: unknown, ruleAlias?: string | null) {
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

  public abstract getSettingDefinition(plugin: LinterPlugin, update: () => void): SettingDefinitionItem;

  protected setOption(value: unknown, settings: LinterSettings): void {
    settings.ruleConfigs[this.ruleAlias][this.configKey] = value;
  }

  // Dot-path into ruleConfigs for the declarative control binding. Resolved by
  // SettingTab's getControlValue/setControlValue. Aliases and configKeys are
  // slug-shaped (no dots), so splitting on '.' is safe.
  protected controlKey(): string {
    return `ruleConfigs.${this.ruleAlias}.${this.configKey}`;
  }

  protected getCurrentValue(plugin: LinterPlugin): unknown {
    return plugin.settings.ruleConfigs[this.ruleAlias]?.[this.configKey] ?? this.defaultValue;
  }

  protected async writeAndSave(value: unknown, plugin: LinterPlugin): Promise<void> {
    plugin.settings.ruleConfigs[this.ruleAlias] ??= {};
    plugin.settings.ruleConfigs[this.ruleAlias][this.configKey] = value;
    await plugin.saveSettings();
  }
}

export class BooleanOption extends Option {
  public defaultValue: boolean;
  private toggleComponent: ToggleComponent | null = null;

  constructor(configKey: string, nameKey: LanguageStringKey, descriptionKey: LanguageStringKey, defaultValue: unknown, ruleAlias?: string | null, public onChange?: (value: boolean, app: App, plugin: LinterPlugin) => void) {
    super(configKey, nameKey, descriptionKey, defaultValue, ruleAlias);
  }

  public getSettingDefinition(plugin: LinterPlugin, _update: () => void): SettingDefinitionItem {
    // An onChange side effect can't be expressed through a control binding, so
    // those (rare) options stay render-based.
    if (this.onChange) {
      return {
        name: this.getName(),
        desc: richDescription(this.getDescription()),
        render: (setting) => {
          setting.addToggle((toggle) => {
            this.toggleComponent = toggle;
            toggle
              .setValue(this.getCurrentValue(plugin) as boolean)
              .onChange(async (value) => {
                await this.writeAndSave(value, plugin);
                this.onChange?.(value, plugin.app, plugin);
              })
        });
        },
      };
    }

    return {
      name: this.getName(),
      desc: richDescription(this.getDescription()),
      control: {type: 'toggle', key: this.controlKey(), defaultValue: this.defaultValue},
    };
  }

  getValue(plugin: LinterPlugin): boolean {
    if (this.toggleComponent != null) {
      return this.toggleComponent.getValue();
    }

    return this.getCurrentValue(plugin);
  }

  async setValue(value: boolean, plugin: LinterPlugin) {
    if (this.toggleComponent != null) {
      this.toggleComponent.setValue(value);
    }

    await this.writeAndSave(value, plugin);
  }
}

export class TextOption extends Option {
  public defaultValue: string;

  public getSettingDefinition(_plugin: LinterPlugin, _update: () => void): SettingDefinitionItem {
    return {
      name: this.getName(),
      desc: richDescription(this.getDescription()),
      control: {type: 'text', key: this.controlKey(), defaultValue: this.defaultValue ?? ''},
    };
  }
}

export class ListItemOption extends Option {
  public defaultValue: string[];

  constructor(configKey: string, nameKey: LanguageStringKey, descriptionKey: LanguageStringKey, defaultValue: unknown, ruleAlias?: string | null, private validator: ListItemValidation | undefined, private emptyStateKey: LanguageStringKey, private fieldPlaceholderKey: LanguageStringKey, private allowReorder: boolean, private trimItemWhitespace: boolean) {
    super(configKey, nameKey, descriptionKey, defaultValue, ruleAlias);
  }

  protected async writeValue(value: unknown, plugin: LinterPlugin): void {
    plugin.settings.ruleConfigs[this.ruleAlias] ??= {};
    plugin.settings.ruleConfigs[this.ruleAlias][this.configKey] = value;
  }

  public getSettingDefinition(plugin: LinterPlugin, update: () => void): SettingDefinitionItem {
    const values = this.getCurrentValue(plugin) as string[] | undefined ?? [];

    return createListManagementPage({
      name: this.getName(),
        desc: richDescription(this.getDescription()),
        addButtonText: getTextInLanguage('add-tooltip'),
        emptyState: getTextInLanguage(this.emptyStateKey),
        values: values,
        allowReorder: this.allowReorder,
        openAddForm: () => new ListItemsModal(plugin.app, null, this.fieldPlaceholderKey, this.trimItemWhitespace, async (entry) => {
          values.push(entry);
          await this.writeAndSave(values, plugin);
          update();
        },
        this.validator).open(),
        openEditForm: (entry, index) => new ListItemsModal(plugin.app, entry, this.fieldPlaceholderKey, this.trimItemWhitespace, async (updated) => {
          values[index] = updated;
          await this.writeAndSave(values, plugin);
          update();
        },
        this.validator).open(),
        editTooltip: getTextInLanguage('edit-tooltip'),
        onDelete: (index) => {
          values.splice(index, 1);
          this.writeValue(values, plugin);
        },
        itemName: (entry) => entry, // we may want to add a default place holder here if we start allowing empty entries
        plugin: plugin,
      });
  }
}

export class MomentFormatOption extends Option {
  public defaultValue: boolean;

  public getSettingDefinition(plugin: LinterPlugin, _update: () => void): SettingDefinitionItem {
    return {
      name: this.getName(),
      desc: richDescription(this.getDescription()),
      render: (setting) => {
        setting.addMomentFormat((format) => format
            .setPlaceholder('dddd, MMMM Do YYYY, h:mm:ss a')
            .setValue((this.getCurrentValue(plugin) as string | undefined) ?? '')
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

  public getSettingDefinition(_plugin: LinterPlugin, _update: () => void): SettingDefinitionItem {
    const options: Record<string, string> = {};
    for (const option of this.options) {
      options[option.value.replace('enums.', '')] = option.getDisplayValue();
    }
    return {
      name: this.getName(),
      desc: richDescription(this.getDescription()),
      control: {type: 'dropdown', key: this.controlKey(), defaultValue: this.defaultValue, options},
    };
  }
}

export class MdFilePickerOption extends Option {
  constructor(configKey: string, nameKey: LanguageStringKey, descriptionKey: LanguageStringKey, ruleAlias?: string | null) {
    super(configKey, nameKey, descriptionKey, [], ruleAlias);
  }

  public getSettingDefinition(plugin: LinterPlugin, update: () => void): SettingDefinitionItem {
    (plugin.settings.ruleConfigs[this.ruleAlias] as {[k:string]: {[k:string]: CustomAutoCorrectContent[]}})[this.configKey] =
        plugin.settings.ruleConfigs[this.ruleAlias][this.configKey] as CustomAutoCorrectContent[] | undefined ?? [];
    const filesPicked: CustomAutoCorrectContent[] = plugin.settings.ruleConfigs[this.ruleAlias][this.configKey] as CustomAutoCorrectContent[];
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

    const list: SettingDefinitionList = {
      type: 'list',
      heading,
      addItem: {
        name: getTextInLanguage('options.custom-auto-correct.add-new-replacement-file-tooltip'),
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- I don't have control over this, so we may as well ignore the promise mismatch
        action: async () => {
          filesPicked.push({filePath: '', customReplacements: null});
          await plugin.saveSettings();
          update();
        },
      },
      extraButtons: [
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
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- I don't have control over this, so we may as well ignore the promise mismatch
      onDelete: async (index) => {
        filesPicked.splice(index, 1);
        await plugin.saveSettings();
        update();
      },
      items: fileRows,
    };

    return {
      type: 'page',
      name: this.getName(),
      desc: warning,
      items: [list],
    };
  }
}

export function createListManagementPage<T>(opts: {
    name: string;
    desc: string | DocumentFragment;
    addButtonText: string;
    emptyState: string;
    values: T[];
    openAddForm: () => void;
    onDelete: (index: number) => void;
    itemName: (entry: T) => string;
    itemDesc?: (entry: T) => string | undefined;
    itemIsDisabled?: (entry: T) => boolean;
    allowReorder?: boolean | undefined;
    openEditForm?: (entry: T, index: number) => void;
    editTooltip?: string;
    plugin: LinterPlugin;
  }): SettingDefinitionPage<LinterSettingsKeys> {
    const list: SettingDefinitionList<LinterSettingsKeys> = {
      type: 'list',
      emptyState: opts.emptyState,
      addItem: {
        name: opts.addButtonText,
        action: opts.openAddForm,
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- I don't have control over this, so we may as well ignore the promise mismatch
      onDelete: async (index: number) => {
        opts.onDelete(index);
        await opts.plugin.saveSettings();
        opts.plugin.settingsTab.update();
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- I don't have control over this, so we may as well ignore the promise mismatch
      onReorder: !opts.allowReorder ? undefined : async (oldIndex: number, newIndex: number) => {
        const [moved] = opts.values.splice(oldIndex, 1);
        opts.values.splice(newIndex, 0, moved);
        await  opts.plugin.saveSettings();
      },
      items: opts.values.map((entry): SettingDefinition<LinterSettingsKeys> => {
        const base = {
          name: opts.itemName(entry),
          desc: opts.itemDesc?.(entry),
          searchable: false,
        } as const;
        if (!opts.openEditForm) return base;
        return {
          ...base,
          render: (setting) => {
            setting.setName(base.name);
            if (base.desc !== undefined) setting.setDesc(base.desc);
            if (opts.itemIsDisabled && opts.itemIsDisabled(entry)) {
              setting.nameEl.addClass('disabled-list-entry');
              setting.descEl.addClass('disabled-list-entry');
            }
            setting.addExtraButton((cb) => cb
                .setIcon('lucide-pencil')
                .setTooltip(opts.editTooltip ?? 'Edit')
                // Resolve the live index at click time — a captured map index
                // goes stale after a reorder or delete.
                .onClick(() => opts.openEditForm(entry, opts.values.indexOf(entry))));
          },
        };
      }),
    };

    return {
      type: 'page',
      name: opts.name,
      desc: opts.desc,
      items: [list],
    };
  }
