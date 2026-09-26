import {App, PluginSettingTab, moment} from 'obsidian';
import type {SettingDefinition, SettingDefinitionGroup, SettingDefinitionItem, SettingDefinitionPage, SettingGroupItem} from 'obsidian';
import log from 'loglevel';
import LinterPlugin from '../main';
import {Rule, RuleType, ruleTypeToRules} from '../rules';
import {richDescription} from './helpers';
import {getTextInLanguage, LanguageStringKey} from '../lang/helpers';
import {LinterSettingsKeys} from '../settings-data';
import {NormalArrayFormats, SpecialArrayFormats, TagSpecificArrayFormats} from '../utils/yaml';
import {logsFromLastRun, setLogLevel} from '../utils/logger';
import {getPath, setPath} from '../utils/nested-keyof';
import {CustomCommandModal, AddFileExtensionModal, AddFileToIgnoreModal, AddFolderToIgnoreModal, CustomRegexModal} from './modals/add-list-entry-modals';
import { createListManagementPage } from '../option';

const tabNameKeys: Record<RuleType | 'Custom' | 'Debug', LanguageStringKey> = {
  [RuleType.YAML]: 'tabs.names.yaml',
  [RuleType.HEADING]: 'tabs.names.heading',
  [RuleType.FOOTNOTE]: 'tabs.names.footnote',
  [RuleType.CONTENT]: 'tabs.names.content',
  [RuleType.SPACING]: 'tabs.names.spacing',
  [RuleType.PASTE]: 'tabs.names.paste',
  Custom: 'tabs.names.custom',
  Debug: 'tabs.names.debug',
};

const logLevels = Object.keys(log.levels);

export class SettingTab extends PluginSettingTab {
  constructor(app: App, public plugin: LinterPlugin) {
    super(app, plugin);
  }

  getControlValue(key: string): unknown {
    return getPath(this.plugin.settings, key);
  }

  async setControlValue(key: string, value: unknown): Promise<void> {
    setPath(this.plugin.settings, key, value);
    await this.plugin.saveSettings();
  }

  getSettingDefinitions(): SettingDefinitionItem<LinterSettingsKeys>[] {
    return [
      ...this.generalDefinitions(),
      this.commonStylesGroup(),
      {
        type: 'group',
        heading: getTextInLanguage('tabs.general.files-and-folders'),
        items: [
          this.foldersToIgnorePage(),
          this.filesToIgnorePage(),
          this.additionalFileExtensionsPage(),
        ],
      },
      {
        type: 'group',
        heading: getTextInLanguage('tabs.general.rules'),
        items: Object.values(RuleType).map((rt) => this.rulePageFor(rt)),
      },
      this.customPage(),
      this.debugPage(),
    ];
  }

  private generalDefinitions(): SettingDefinitionItem<LinterSettingsKeys>[] {
    const settings = this.plugin.settings;
    const items: SettingDefinitionItem<LinterSettingsKeys>[] = [];

    items.push({
      name: getTextInLanguage('tabs.general.lint-on-save.name'),
      desc: richDescription(getTextInLanguage('tabs.general.lint-on-save.description')),
      render: (setting) => {
        setting.addToggle((tg) => tg
            .setValue(settings.lintOnSave)
            .onChange(async (value) => {
              settings.lintOnSave = value;
              await this.plugin.saveSettings();
              this.refreshDomState();
            }));
      },
    });

    items.push({
      name: getTextInLanguage('tabs.general.display-message.name'),
      desc: richDescription(getTextInLanguage('tabs.general.display-message.description')),
      visible: () => settings.lintOnSave,
      control: {type: 'toggle', key: 'displayChanged'},
    });

    items.push({
      name: getTextInLanguage('tabs.general.lint-on-file-change.name'),
      desc: richDescription(getTextInLanguage('tabs.general.lint-on-file-change.description')),
      render: (setting) => {
        setting.addToggle((tg) => tg
            .setValue(settings.lintOnFileChange)
            .onChange(async (value) => {
              settings.lintOnFileChange = value;
              await this.plugin.saveSettings();
              this.refreshDomState();
            }));
      },
    });

    items.push({
      name: getTextInLanguage('tabs.general.display-lint-on-file-change-message.name'),
      desc: richDescription(getTextInLanguage('tabs.general.display-lint-on-file-change-message.description')),
      visible: () => settings.lintOnFileChange,
      control: {type: 'toggle', key: 'displayLintOnFileChangeNotice'},
    });

    items.push({
      name: getTextInLanguage('tabs.general.suppress-message-when-no-change.name'),
      desc: richDescription(getTextInLanguage('tabs.general.suppress-message-when-no-change.description')),
      control: {type: 'toggle', key: 'suppressMessageWhenNoChange'},
    });

    items.push({
      name: getTextInLanguage('tabs.general.enable-diff-preview-view.name'),
      desc: richDescription(getTextInLanguage('tabs.general.enable-diff-preview-view.description')),
      control: {type: 'toggle', key: 'enableDiffPreviewView'},
    });

    const sysLocale = navigator.language?.toLowerCase();
    const localeOptions: Record<string, string> = {
      'system-default': getTextInLanguage('tabs.general.same-as-system-locale').replace('{SYS_LOCALE}', sysLocale),
    };
    for (const locale of moment.locales()) {
      localeOptions[locale] = locale;
    }

    items.push({
      name: getTextInLanguage('tabs.general.override-locale.name'),
      desc: richDescription(getTextInLanguage('tabs.general.override-locale.description')),
      render: (setting) => {
        setting.addDropdown((dd) => {
          for (const [value, label] of Object.entries(localeOptions)) {
            dd.addOption(value, label);
          }
          dd.setValue(settings.linterLocale);
          dd.onChange(async (value) => {
            settings.linterLocale = value;
            await this.plugin.saveSettings();
            await this.plugin.setOrUpdateMomentInstance();
          });
        });
      },
    });

    return items;
  }

  private commonStylesGroup(): SettingDefinitionGroup<LinterSettingsKeys> {
    const enumOptions = (values: string[]): Record<string, string> => {
      const options: Record<string, string> = {};
      for (const v of values) {
        options[v] = getTextInLanguage(('enums.' + v) as LanguageStringKey);
      }
      return options;
    };

    return {
      type: 'group',
      heading: getTextInLanguage('tabs.general.yaml'),
      items: [
        {
          name: getTextInLanguage('tabs.general.yaml-aliases-section-style.name'),
          desc: richDescription(getTextInLanguage('tabs.general.yaml-aliases-section-style.description')),
          control: {
            type: 'dropdown',
            key: 'commonStyles.aliasArrayStyle',
            options: enumOptions([
              NormalArrayFormats.MultiLine,
              NormalArrayFormats.SingleLine,
              SpecialArrayFormats.SingleStringCommaDelimited,
              SpecialArrayFormats.SingleStringToSingleLine,
              SpecialArrayFormats.SingleStringToMultiLine,
            ]),
          },
        },
        {
          name: getTextInLanguage('tabs.general.yaml-tags-section-style.name'),
          desc: richDescription(getTextInLanguage('tabs.general.yaml-tags-section-style.description')),
          control: {
            type: 'dropdown',
            key: 'commonStyles.tagArrayStyle',
            options: enumOptions([
              NormalArrayFormats.MultiLine,
              NormalArrayFormats.SingleLine,
              SpecialArrayFormats.SingleStringToSingleLine,
              SpecialArrayFormats.SingleStringToMultiLine,
              TagSpecificArrayFormats.SingleLineSpaceDelimited,
              TagSpecificArrayFormats.SingleStringSpaceDelimited,
              SpecialArrayFormats.SingleStringCommaDelimited,
            ]),
          },
        },
        {
          name: getTextInLanguage('tabs.general.default-escape-character.name'),
          desc: richDescription(getTextInLanguage('tabs.general.default-escape-character.description')),
          control: {
            type: 'dropdown',
            key: 'commonStyles.escapeCharacter',
            options: {'"': '"', '\'': '\''},
          },
        },
        {
          name: getTextInLanguage('tabs.general.remove-unnecessary-escape-chars-in-multi-line-arrays.name'),
          desc: richDescription(getTextInLanguage('tabs.general.remove-unnecessary-escape-chars-in-multi-line-arrays.description')),
          control: {type: 'toggle', key: 'commonStyles.removeUnnecessaryEscapeCharsForMultiLineArrays'},
        },
        {
          name: getTextInLanguage('tabs.general.number-of-dollar-signs-to-indicate-math-block.name'),
          desc: richDescription(getTextInLanguage('tabs.general.number-of-dollar-signs-to-indicate-math-block.description')),
          control: {
            type: 'number',
            key: 'commonStyles.minimumNumberOfDollarSignsToBeAMathBlock',
            min: 1,
            validate: (value) => Number.isInteger(value) && value >= 1 ? undefined : getTextInLanguage('tabs.general.number-of-dollar-signs-to-indicate-math-block.invalid'),
          },
        },
      ],
    };
  }

  private foldersToIgnorePage(): SettingDefinitionPage<LinterSettingsKeys> {
    const folders = this.plugin.settings.foldersToIgnore;
    return createListManagementPage({
      name: getTextInLanguage('tabs.general.folders-to-ignore.name'),
      desc: richDescription(getTextInLanguage('tabs.general.folders-to-ignore.description')),
      addButtonText: getTextInLanguage('tabs.general.folders-to-ignore.add-input-button-text'),
      emptyState: getTextInLanguage('tabs.general.folders-to-ignore.empty-state'),
      values: folders,
      openAddForm: () => new AddFolderToIgnoreModal(this.app, folders, async (path) => {
        folders.push(path);
        await this.plugin.saveSettings();
        this.update();
      }).open(),
      onDelete: (index) => folders.splice(index, 1),
      itemName: (folder) => folder || getTextInLanguage('tabs.general.folders-to-ignore.folder-search-placeholder-text'),
      plugin: this.plugin,
    });
  }

  private filesToIgnorePage(): SettingDefinitionPage<LinterSettingsKeys> {
    const filesToIgnore = this.plugin.settings.filesToIgnore;
    return createListManagementPage({
      name: getTextInLanguage('tabs.general.files-to-ignore.name'),
      desc: richDescription(getTextInLanguage('tabs.general.files-to-ignore.description')),
      addButtonText: getTextInLanguage('tabs.general.files-to-ignore.add-input-button-text'),
      emptyState: getTextInLanguage('tabs.general.files-to-ignore.empty-state'),
      values: filesToIgnore,
      openAddForm: () => new AddFileToIgnoreModal(this.app, async (entry) => {
        filesToIgnore.push(entry);
        await this.plugin.saveSettings();
        this.update();
      }).open(),
      onDelete: (index) => filesToIgnore.splice(index, 1),
      itemName: (entry) => entry.label || entry.match || getTextInLanguage('tabs.general.files-to-ignore.label-placeholder-text'),
      itemDesc: (entry) => entry.label && entry.match ? this.buildRegexDisplay(entry.match, entry.flags) : undefined,
      plugin: this.plugin,
    });
  }

  private buildRegexDisplay(match: string, flags: string, replace?: string): string {
    return `/${match}/${replace != undefined ? replace + '/' : ''}${flags}`;
  }

  private additionalFileExtensionsPage(): SettingDefinitionPage<LinterSettingsKeys> {
    const extensions = this.plugin.settings.additionalFileExtensions;
    return createListManagementPage({
      name: getTextInLanguage('tabs.general.additional-file-extensions.name'),
      desc: richDescription(getTextInLanguage('tabs.general.additional-file-extensions.description')),
      addButtonText: getTextInLanguage('tabs.general.additional-file-extensions.add-input-button-text'),
      emptyState: getTextInLanguage('tabs.general.additional-file-extensions.empty-state'),
      values: extensions,
      openAddForm: () => new AddFileExtensionModal(this.app, extensions, async (ext) => {
        extensions.push(ext);
        await this.plugin.saveSettings();
        this.update();
      }).open(),
      onDelete: (index) => extensions.splice(index, 1),
      itemName: (ext) => ext || getTextInLanguage('tabs.general.additional-file-extensions.extension-placeholder'),
    });
  }

  private rulePageFor(ruleType: RuleType): SettingDefinitionPage<LinterSettingsKeys> {
    const rules = ruleTypeToRules.get(ruleType) ?? [];

    return {
      type: 'page',
      name: getTextInLanguage(tabNameKeys[ruleType]),
      items: rules.map((rule) => this.ruleToGroup(rule)),
    };
  }

  private ruleToGroup(rule: Rule): SettingDefinitionGroup<LinterSettingsKeys> {
    const settings = this.plugin.settings;
    const enabled = !!settings.ruleConfigs[rule.alias]?.enabled;

    const enabledItem: SettingGroupItem<LinterSettingsKeys> = {
      name: rule.getName(),
      aliases: [rule.alias],
      render: (setting) => {
        setting
            .setDesc(richDescription(rule.getDescription()))
            .addExtraButton((component) => component
                .setIcon('book-open')
                .onClick(() => {
                  window.open(rule.getURL(), '_blank');
                }))
            .addToggle((tg) => tg
                .setValue(enabled)
                .onChange(async (value) => {
                  if (!settings.ruleConfigs[rule.alias]) {
                    settings.ruleConfigs[rule.alias] = rule.getDefaultOptions();
                  }
                  settings.ruleConfigs[rule.alias].enabled = value;
                  rule.runEnabledSideEffect(value, this.app, this.plugin);
                  await this.plugin.saveSettings();
                  this.update();
                }));
      },
    };

    const items: SettingGroupItem<LinterSettingsKeys>[] = [enabledItem];
    if (enabled) {
      for (let i = 1; i < rule.options.length; i++) {
        items.push(rule.options[i].getSettingDefinition(this.plugin, () => this.update()) as SettingGroupItem<LinterSettingsKeys>);
      }
    }

    return {
      type: 'group',
      items,
    };
  }

  private customPage(): SettingDefinitionPage<LinterSettingsKeys> {
    return {
      type: 'page',
      name: getTextInLanguage(tabNameKeys.Custom),
      items: [
        this.customCommandsPage(),
        this.customRegexesPage(),
      ],
    };
  }

  private customCommandsPage(): SettingDefinitionPage<LinterSettingsKeys> {
    const lintCommands = this.plugin.settings.lintCommands;
    return createListManagementPage({
      name: getTextInLanguage('options.custom-command.name'),
      desc: richDescription(getTextInLanguage('options.custom-command.description')),
      addButtonText: getTextInLanguage('options.custom-command.add-input-button-text'),
      emptyState: getTextInLanguage('options.custom-command.empty-state'),
      values: lintCommands,
      allowReorder: true,
      openAddForm: () => new CustomCommandModal(this.app, null, lintCommands, async (command) => {
        lintCommands.push(command);
        await this.plugin.saveSettings();
        this.update();
      }).open(),
      openEditForm: (entry, index) => new CustomCommandModal(this.app, entry, lintCommands, async (updated) => {
        lintCommands[index] = updated;
        await this.plugin.saveSettings();
        this.update();
      }).open(),
      onDelete: (index) => lintCommands.splice(index, 1),
      itemName: (entry) => (entry && entry.name) || getTextInLanguage('options.custom-command.command-search-placeholder-text'),
      itemDesc: (entry) => (entry && entry.id) || '',
      itemIsDisabled: (entry) => !entry.enabled,
      plugin: this.plugin,
    });
  }

  private customRegexesPage(): SettingDefinitionPage<LinterSettingsKeys> {
    const regexes = this.plugin.settings.customRegexes;
    return createListManagementPage({
      name: getTextInLanguage('options.custom-replace.name'),
      desc: richDescription(getTextInLanguage('options.custom-replace.description')),
      addButtonText: getTextInLanguage('options.custom-replace.add-input-button-text'),
      emptyState: getTextInLanguage('options.custom-replace.empty-state'),
      values: regexes,
      allowReorder: true,
      openAddForm: () => new CustomRegexModal(this.app, null, async (entry) => {
        regexes.push(entry);
        await this.plugin.saveSettings();
        this.update();
      }).open(),
      openEditForm: (entry, index) => new CustomRegexModal(this.app, entry, async (updated) => {
        regexes[index] = updated;
        await this.plugin.saveSettings();
        this.update();
      }).open(),
      editTooltip: getTextInLanguage('options.custom-replace.edit-tooltip'),
      onDelete: (index) => regexes.splice(index, 1),
      itemName: (entry) => entry.label || entry.find || getTextInLanguage('options.custom-replace.label-placeholder-text'),
      itemDesc: (entry) => entry.find && entry.label ? entry.find : undefined,
      itemIsDisabled: (entry) => !entry.enabled,
      plugin: this.plugin,
    });
  }

  private debugPage(): SettingDefinitionPage<LinterSettingsKeys> {
    const settings = this.plugin.settings;
    const items: SettingDefinition<LinterSettingsKeys>[] = [
      {
        name: getTextInLanguage('tabs.debug.log-level.name'),
        desc: richDescription(getTextInLanguage('tabs.debug.log-level.description')),
        render: (setting) => {
          setting.addDropdown((dd) => {
            for (const v of logLevels) {
              dd.addOption(v, getTextInLanguage(('enums.' + v) as LanguageStringKey) ?? v);
            }
            dd.setValue(settings.logLevel);
            dd.onChange(async (value) => {
              settings.logLevel = value;
              await this.plugin.saveSettings();
              setLogLevel(settings.logLevel);
            });
          });
        },
      },
      {
        name: getTextInLanguage('tabs.debug.linter-config.name'),
        desc: richDescription(getTextInLanguage('tabs.debug.linter-config.description')),
        render: (setting) => {
          setting.addTextArea((cb) => {
            cb.inputEl.readOnly = true;
            cb.setValue(JSON.stringify(settings, null, 2));
            cb.inputEl.addClass('linter-debug-readonly');
          });
        },
      },
      {
        name: getTextInLanguage('tabs.debug.log-collection.name'),
        desc: richDescription(getTextInLanguage('tabs.debug.log-collection.description')),
        render: (setting) => {
          setting.addToggle((tg) => tg
              .setValue(settings.recordLintOnSaveLogs)
              .onChange(async (value) => {
                settings.recordLintOnSaveLogs = value;
                await this.plugin.saveSettings();
                this.refreshDomState();
              }));
        },
      },
      {
        name: getTextInLanguage('tabs.debug.linter-logs.name'),
        desc: richDescription(getTextInLanguage('tabs.debug.linter-logs.description')),
        visible: () => settings.recordLintOnSaveLogs,
        render: (setting) => {
          setting.addTextArea((cb) => {
            cb.inputEl.readOnly = true;
            cb.setValue(logsFromLastRun.join('\n'));
            cb.inputEl.addClass('linter-debug-readonly');
          });
        },
      },
    ];

    return {
      type: 'page',
      name: getTextInLanguage(tabNameKeys.Debug),
      items,
    };
  }
}
