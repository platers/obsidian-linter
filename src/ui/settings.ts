import {App, Platform, PluginSettingTab, moment} from 'obsidian';
import type {SettingDefinition, SettingDefinitionGroup, SettingDefinitionItem, SettingDefinitionPage, SettingGroupItem} from 'obsidian';
import log from 'loglevel';
import LinterPlugin from '../main';
import {Rule, RuleType, ruleTypeToRules} from '../rules';
import {hideEl, richDescription} from './helpers';
import {SearchStatus, Tab} from './linter-components/tab-components/tab';
import {GeneralTab} from './linter-components/tab-components/general-tab';
import {RuleTab} from './linter-components/tab-components/rule-tab';
import {CustomTab} from './linter-components/tab-components/custom-tab';
import {TabSearcher} from './linter-components/tab-components/tab-searcher';
import {DebugTab} from './linter-components/tab-components/debug-tab';
import {getTextInLanguage, LanguageStringKey} from '../lang/helpers';
import {LinterSettings} from '../settings-data';
import {NormalArrayFormats, SpecialArrayFormats, TagSpecificArrayFormats} from 'src/utils/yaml';
import {logsFromLastRun, setLogLevel} from '../utils/logger';
import CommandSuggester from './suggesters/command-suggester';
import {LintCommand} from './linter-components/custom-command-option';
import {AddFileExtensionModal, AddFileToIgnoreModal, AddFolderToIgnoreModal} from './modals/add-list-entry-modals';

type LSKey = keyof LinterSettings & string;

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

const logLevels = Object.keys(log.levels) as string[];

export class SettingTab extends PluginSettingTab<LinterSettings> {
  navContainer: HTMLElement;
  tabNavEl: HTMLDivElement;
  settingsContentEl: HTMLDivElement;
  private tabNameToTab: Map<string, Tab> = new Map<string, Tab>();
  private selectedTab: string = 'General';
  private searchZeroState: HTMLDivElement;
  private tabSearcher: TabSearcher;

  constructor(app: App, public plugin: LinterPlugin) {
    super(app, plugin, plugin.settings);
  }

  display(): void {
    const {containerEl} = this;

    containerEl.empty();
    const linterHeader = containerEl.createDiv('linter-setting-title');
    if (Platform.isMobile) {
      linterHeader.addClass('linter-mobile');
    } else {
      linterHeader.createEl('h1').setText(getTextInLanguage('linter-title'));
    }

    this.navContainer = containerEl.createEl('nav', {cls: 'linter-setting-header'});
    this.tabNavEl = this.navContainer.createDiv('linter-setting-tab-group');
    this.settingsContentEl = containerEl.createDiv('linter-setting-content');
    this.addTabs(Platform.isMobile);
    this.createSearchZeroState();
    this.generateSearchBar(linterHeader);

    if (this.selectedTab == '') {
      this.tabSearcher.focusOnInput();
    }
  }

  private addTabs(isMobile: boolean) {
    this.addTab(new GeneralTab(this.tabNavEl, this.settingsContentEl, isMobile, this.plugin, this.app));

    for (const ruleType of Object.values(RuleType)) {
      this.addTab(new RuleTab(this.tabNavEl, this.settingsContentEl, ruleType, ruleTypeToRules.get(ruleType), isMobile, this.plugin));
    }

    this.addTab(new CustomTab(this.tabNavEl, this.settingsContentEl, isMobile, this.app, this.plugin));
    this.addTab(new DebugTab(this.tabNavEl, this.settingsContentEl, isMobile, this.plugin));
  }

  private generateSearchBar(containerEl: HTMLDivElement) {
    this.tabSearcher = new TabSearcher(containerEl, this.searchZeroState, this.tabNameToTab, () => {
      for (const tab of this.tabNameToTab.values()) {
        tab.updateTabDisplayMode(false, SearchStatus.EnteringSearchMode);

        const searchVal = this.tabSearcher.search.getValue();
        if (this.selectedTab == '' && searchVal.trim() != '') {
          this.tabSearcher.searchSettings(searchVal.toLowerCase());
        }

        this.selectedTab = '';
      }
    });
  }

  private createSearchZeroState() {
    this.searchZeroState = this.settingsContentEl.createDiv({cls: 'search-zero-state'});
    hideEl(this.searchZeroState);
    this.searchZeroState.createEl('p', {text: getTextInLanguage('empty-search-results-text')});
  }

  private addTab(tab: Tab) {
    tab.navButton.onclick = () => {
      this.onTabClick(tab.name);
    };

    tab.updateTabDisplayMode(this.selectedTab === tab.name, SearchStatus.None);

    this.tabNameToTab.set(tab.name, tab);
  }

  onTabClick(clickedTabName: string) {
    if (this.selectedTab === clickedTabName) {
      return;
    }

    if (this.selectedTab == '') {
      for (const [tabName, tab] of this.tabNameToTab) {
        tab.updateTabDisplayMode(tabName === clickedTabName, SearchStatus.LeavingSearchMode);
      }
    } else {
      hideEl(this.searchZeroState);
      const clickedTab = this.tabNameToTab.get(clickedTabName);
      clickedTab.updateTabDisplayMode(true);

      const previouslySelectedTab = this.tabNameToTab.get(this.selectedTab);
      previouslySelectedTab.updateTabDisplayMode(false);
    }

    this.selectedTab = clickedTabName;
  }

  // 1.12.x fallback lives in display() above.
  // 1.12.x fallback lives in display() above.
  getSettingDefinitions(): SettingDefinitionItem<LSKey>[] {
    return [
      ...this.generalDefinitions(),
      this.commonStylesGroup(),
      {
        type: 'group',
        heading: 'Files and folders',
        items: [
          this.foldersToIgnorePage(),
          this.filesToIgnorePage(),
          this.additionalFileExtensionsPage(),
        ],
      },
      {
        type: 'group',
        heading: 'Rules',
        items: Object.values(RuleType).map((rt) => this.rulePageFor(rt)),
      },
      this.customPage(),
      this.debugPage(),
    ];
  }

  private generalDefinitions(): SettingDefinitionItem<LSKey>[] {
    const settings = this.plugin.settings;
    const items: SettingDefinitionItem<LSKey>[] = [];

    items.push({
      name: getTextInLanguage('tabs.general.lint-on-save.name'),
      desc: richDescription(getTextInLanguage('tabs.general.lint-on-save.description')),
      render: (setting) => {
        setting.addToggle((tg) => tg
            .setValue(settings.lintOnSave)
            .onChange(async (value) => {
              settings.lintOnSave = value;
              await this.plugin.saveSettings();
              this.update();
            }));
      },
    });

    if (settings.lintOnSave) {
      items.push({
        name: getTextInLanguage('tabs.general.display-message.name'),
        desc: richDescription(getTextInLanguage('tabs.general.display-message.description')),
        control: {type: 'toggle', key: 'displayChanged'},
      });
    }

    items.push({
      name: getTextInLanguage('tabs.general.lint-on-file-change.name'),
      desc: richDescription(getTextInLanguage('tabs.general.lint-on-file-change.description')),
      render: (setting) => {
        setting.addToggle((tg) => tg
            .setValue(settings.lintOnFileChange)
            .onChange(async (value) => {
              settings.lintOnFileChange = value;
              await this.plugin.saveSettings();
              this.update();
            }));
      },
    });

    if (settings.lintOnFileChange) {
      items.push({
        name: getTextInLanguage('tabs.general.display-lint-on-file-change-message.name'),
        desc: richDescription(getTextInLanguage('tabs.general.display-lint-on-file-change-message.description')),
        control: {type: 'toggle', key: 'displayLintOnFileChangeNotice'},
      });
    }

    items.push({
      name: getTextInLanguage('tabs.general.suppress-message-when-no-change.name'),
      desc: richDescription(getTextInLanguage('tabs.general.suppress-message-when-no-change.description')),
      control: {type: 'toggle', key: 'suppressMessageWhenNoChange'},
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

  // TODO(framework): collapse the body to `control` bindings once dotted keys land.
  private commonStylesGroup(): SettingDefinitionGroup<LSKey> {
    const settings = this.plugin.settings;
    const aliasFormats = [
      NormalArrayFormats.MultiLine,
      NormalArrayFormats.SingleLine,
      SpecialArrayFormats.SingleStringCommaDelimited,
      SpecialArrayFormats.SingleStringToSingleLine,
      SpecialArrayFormats.SingleStringToMultiLine,
    ];
    const tagFormats = [
      NormalArrayFormats.MultiLine,
      NormalArrayFormats.SingleLine,
      SpecialArrayFormats.SingleStringToSingleLine,
      SpecialArrayFormats.SingleStringToMultiLine,
      TagSpecificArrayFormats.SingleLineSpaceDelimited,
      TagSpecificArrayFormats.SingleStringSpaceDelimited,
      SpecialArrayFormats.SingleStringCommaDelimited,
    ];
    const escapeChars = ['"', '\''];

    return {
      type: 'group',
      heading: 'YAML common styles',
      items: [
        {
          name: getTextInLanguage('tabs.general.yaml-aliases-section-style.name'),
          desc: richDescription(getTextInLanguage('tabs.general.yaml-aliases-section-style.description')),
          render: (setting) => {
            setting.addDropdown((dd) => {
              for (const v of aliasFormats) {
                dd.addOption(v as string, getTextInLanguage(('enums.' + v) as LanguageStringKey));
              }
              dd.setValue(settings.commonStyles.aliasArrayStyle);
              dd.onChange(async (value) => {
                settings.commonStyles.aliasArrayStyle = value as NormalArrayFormats | SpecialArrayFormats;
                await this.plugin.saveSettings();
              });
            });
          },
        },
        {
          name: getTextInLanguage('tabs.general.yaml-tags-section-style.name'),
          desc: richDescription(getTextInLanguage('tabs.general.yaml-tags-section-style.description')),
          render: (setting) => {
            setting.addDropdown((dd) => {
              for (const v of tagFormats) {
                dd.addOption(v as string, getTextInLanguage(('enums.' + v) as LanguageStringKey));
              }
              dd.setValue(settings.commonStyles.tagArrayStyle);
              dd.onChange(async (value) => {
                settings.commonStyles.tagArrayStyle = value as NormalArrayFormats | SpecialArrayFormats | TagSpecificArrayFormats;
                await this.plugin.saveSettings();
              });
            });
          },
        },
        {
          name: getTextInLanguage('tabs.general.default-escape-character.name'),
          desc: richDescription(getTextInLanguage('tabs.general.default-escape-character.description')),
          render: (setting) => {
            setting.addDropdown((dd) => {
              for (const ch of escapeChars) {
                dd.addOption(ch, ch);
              }
              dd.setValue(settings.commonStyles.escapeCharacter);
              dd.onChange(async (value) => {
                settings.commonStyles.escapeCharacter = value as '"' | '\'';
                await this.plugin.saveSettings();
              });
            });
          },
        },
        {
          name: getTextInLanguage('tabs.general.remove-unnecessary-escape-chars-in-multi-line-arrays.name'),
          desc: richDescription(getTextInLanguage('tabs.general.remove-unnecessary-escape-chars-in-multi-line-arrays.description')),
          render: (setting) => {
            setting.addToggle((tg) => tg
                .setValue(settings.commonStyles.removeUnnecessaryEscapeCharsForMultiLineArrays)
                .onChange(async (value) => {
                  settings.commonStyles.removeUnnecessaryEscapeCharsForMultiLineArrays = value;
                  await this.plugin.saveSettings();
                }));
          },
        },
        {
          name: getTextInLanguage('tabs.general.number-of-dollar-signs-to-indicate-math-block.name'),
          desc: richDescription(getTextInLanguage('tabs.general.number-of-dollar-signs-to-indicate-math-block.description')),
          render: (setting) => {
            setting.addText((tx) => {
              tx.inputEl.type = 'number';
              tx.setValue(String(settings.commonStyles.minimumNumberOfDollarSignsToBeAMathBlock));
              tx.onChange(async (value) => {
                const parsed = parseInt(value);
                if (!Number.isNaN(parsed)) {
                  settings.commonStyles.minimumNumberOfDollarSignsToBeAMathBlock = parsed;
                  await this.plugin.saveSettings();
                }
              });
            });
          },
        },
      ],
    };
  }

  private listManagementPage<T>(opts: {
    name: string;
    desc: string;
    addButtonText: string;
    emptyState: string;
    values: T[];
    openAddForm: () => void;
    onDelete: (index: number) => void;
    itemName: (entry: T) => string;
    itemDesc?: (entry: T) => string | undefined;
  }): SettingDefinitionPage<LSKey> {
    const items: (SettingDefinition<LSKey> | SettingDefinitionGroup<LSKey>)[] = [];
    if (Platform.isMobile) {
      items.push({
        name: opts.addButtonText,
        searchable: false,
        action: opts.openAddForm,
      });
    }
    items.push({
      type: 'group',
      cls: 'mod-list',
      emptyState: opts.emptyState,
      extraButtons: Platform.isMobile ? [] : [
        (btn) => btn
            .setIcon('lucide-plus')
            .setTooltip(opts.addButtonText)
            .onClick(opts.openAddForm),
      ],
      onDelete: async (index) => {
        opts.onDelete(index);
        await this.plugin.saveSettings();
        this.update();
      },
      items: opts.values.map((entry): SettingDefinition<LSKey> => ({
        name: opts.itemName(entry),
        desc: opts.itemDesc?.(entry),
        searchable: false,
      })),
    });

    return {
      type: 'page',
      name: opts.name,
      desc: opts.desc,
      items,
    };
  }

  private foldersToIgnorePage(): SettingDefinitionPage<LSKey> {
    const folders = this.plugin.settings.foldersToIgnore;
    return this.listManagementPage({
      name: getTextInLanguage('tabs.general.folders-to-ignore.name'),
      desc: richDescription(getTextInLanguage('tabs.general.folders-to-ignore.description')),
      addButtonText: getTextInLanguage('tabs.general.folders-to-ignore.add-input-button-text'),
      emptyState: 'No folders are being ignored yet.',
      values: folders,
      openAddForm: () => new AddFolderToIgnoreModal(this.app, folders, async (path) => {
        folders.push(path);
        await this.plugin.saveSettings();
        this.update();
      }).open(),
      onDelete: (index) => folders.splice(index, 1),
      itemName: (folder) => folder || getTextInLanguage('tabs.general.folders-to-ignore.folder-search-placeholder-text'),
    });
  }

  private filesToIgnorePage(): SettingDefinitionPage<LSKey> {
    const filesToIgnore = this.plugin.settings.filesToIgnore;
    return this.listManagementPage({
      name: getTextInLanguage('tabs.general.files-to-ignore.name'),
      desc: richDescription(getTextInLanguage('tabs.general.files-to-ignore.description')),
      addButtonText: getTextInLanguage('tabs.general.files-to-ignore.add-input-button-text'),
      emptyState: 'No files are being ignored yet.',
      values: filesToIgnore,
      openAddForm: () => new AddFileToIgnoreModal(this.app, async (entry) => {
        filesToIgnore.push(entry);
        await this.plugin.saveSettings();
        this.update();
      }).open(),
      onDelete: (index) => filesToIgnore.splice(index, 1),
      itemName: (entry) => entry.label || entry.match || getTextInLanguage('tabs.general.files-to-ignore.label-placeholder-text'),
      itemDesc: (entry) => entry.label && entry.match ? entry.match : undefined,
    });
  }

  private additionalFileExtensionsPage(): SettingDefinitionPage<LSKey> {
    const extensions = this.plugin.settings.additionalFileExtensions;
    return this.listManagementPage({
      name: getTextInLanguage('tabs.general.additional-file-extensions.name'),
      desc: richDescription(getTextInLanguage('tabs.general.additional-file-extensions.description')),
      addButtonText: getTextInLanguage('tabs.general.additional-file-extensions.add-input-button-text'),
      emptyState: 'No additional file extensions yet.',
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

  private rulePageFor(ruleType: RuleType): SettingDefinitionPage<LSKey> {
    const rules = ruleTypeToRules.get(ruleType) ?? [];
    return {
      type: 'page',
      name: getTextInLanguage(tabNameKeys[ruleType]),
      items: rules.map((rule) => this.ruleToGroup(rule)),
    };
  }

  private ruleToGroup(rule: Rule): SettingDefinitionGroup<LSKey> {
    const settings = this.plugin.settings;
    const enabled = !!settings.ruleConfigs[rule.alias]?.enabled;

    const enabledItem: SettingGroupItem<LSKey> = {
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
                  rule.runEnabledSideEffect(value, this.app);
                  await this.plugin.saveSettings();
                  this.update();
                }));
      },
    };

    const items: SettingGroupItem<LSKey>[] = [enabledItem];
    if (enabled) {
      for (let i = 1; i < rule.options.length; i++) {
        items.push(rule.options[i].getSettingDefinition(this.plugin, () => this.update()) as SettingGroupItem<LSKey>);
      }
    }

    return {
      type: 'group',
      items,
    };
  }

  private customPage(): SettingDefinitionPage<LSKey> {
    return {
      type: 'page',
      name: getTextInLanguage(tabNameKeys.Custom),
      items: [
        this.customCommandsGroup(),
        this.customRegexesGroup(),
      ],
    };
  }

  private customCommandsGroup(): SettingDefinitionGroup<LSKey> {
    const lintCommands = this.plugin.settings.lintCommands;
    return {
      type: 'group',
      cls: 'mod-list',
      heading: getTextInLanguage('options.custom-command.name'),
      extraButtons: [
        (btn) => btn
            .setIcon('plus-with-circle')
            .setTooltip(getTextInLanguage('options.custom-command.add-input-button-text'))
            .onClick(async () => {
              lintCommands.push({id: '', name: '', enabled: true});
              await this.plugin.saveSettings();
              this.update();
            }),
      ],
      onReorder: async (fromIndex, toIndex) => {
        const [moved] = lintCommands.splice(fromIndex, 1);
        lintCommands.splice(toIndex, 0, moved);
        await this.plugin.saveSettings();
      },
      onDelete: async (index) => {
        lintCommands.splice(index, 1);
        await this.plugin.saveSettings();
        this.update();
      },
      items: lintCommands.map((command, index) => ({
        name: command.name || getTextInLanguage('options.custom-command.command-search-placeholder-text'),
        searchable: false,
        render: (setting) => {
          setting.addSearch((cb) => {
            new CommandSuggester(this.app, cb.inputEl, lintCommands);
            cb.setPlaceholder(getTextInLanguage('options.custom-command.command-search-placeholder-text'))
                .setValue(command.name)
                .onChange(async (newName) => {
                  const id = cb.inputEl.getAttribute('commandId');
                  const newCommand: LintCommand = {id, name: newName, enabled: command.enabled};
                  if ((newName && id) || (!newName && !id)) {
                    lintCommands[index] = newCommand;
                    await this.plugin.saveSettings();
                  }
                });
          });
          setting.addToggle((tg) => tg
              .setValue(command.enabled)
              .onChange(async (value) => {
                lintCommands[index].enabled = value;
                await this.plugin.saveSettings();
              }));
        },
      })),
    };
  }

  private customRegexesGroup(): SettingDefinitionGroup<LSKey> {
    const regexes = this.plugin.settings.customRegexes;
    const defaultFlags = 'gm';
    return {
      type: 'group',
      cls: 'mod-list',
      heading: getTextInLanguage('options.custom-replace.name'),
      extraButtons: [
        (btn) => btn
            .setIcon('plus-with-circle')
            .setTooltip(getTextInLanguage('options.custom-replace.add-input-button-text'))
            .onClick(async () => {
              regexes.push({label: '', find: '', replace: '', flags: defaultFlags, enabled: true});
              await this.plugin.saveSettings();
              this.update();
            }),
      ],
      onReorder: async (fromIndex, toIndex) => {
        const [moved] = regexes.splice(fromIndex, 1);
        regexes.splice(toIndex, 0, moved);
        await this.plugin.saveSettings();
      },
      onDelete: async (index) => {
        regexes.splice(index, 1);
        await this.plugin.saveSettings();
        this.update();
      },
      items: regexes.map((regex, index) => ({
        name: regex.label || getTextInLanguage('options.custom-replace.label-placeholder-text'),
        searchable: false,
        render: (setting) => {
          setting.addText((cb) => cb
              .setPlaceholder(getTextInLanguage('options.custom-replace.label-placeholder-text'))
              .setValue(regex.label)
              .onChange(async (value) => {
                regexes[index].label = value;
                await this.plugin.saveSettings();
              }));
          setting.addText((cb) => cb
              .setPlaceholder(getTextInLanguage('options.custom-replace.regex-to-find-placeholder-text'))
              .setValue(regex.find)
              .onChange(async (value) => {
                regexes[index].find = value;
                await this.plugin.saveSettings();
              }));
          setting.addText((cb) => cb
              .setPlaceholder(getTextInLanguage('options.custom-replace.flags-placeholder-text'))
              .setValue(regex.flags)
              .onChange(async (value) => {
                regexes[index].flags = value;
                await this.plugin.saveSettings();
              }));
          setting.addText((cb) => cb
              .setPlaceholder(getTextInLanguage('options.custom-replace.regex-to-replace-placeholder-text'))
              .setValue(regex.replace)
              .onChange(async (value) => {
                regexes[index].replace = value;
                await this.plugin.saveSettings();
              }));
          setting.addToggle((tg) => tg
              .setValue(regex.enabled)
              .onChange(async (value) => {
                regexes[index].enabled = value;
                await this.plugin.saveSettings();
              }));
        },
      })),
    };
  }

  private debugPage(): SettingDefinitionPage<LSKey> {
    const settings = this.plugin.settings;
    const items: SettingDefinition<LSKey>[] = [
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
                this.update();
              }));
        },
      },
    ];

    if (settings.recordLintOnSaveLogs) {
      items.push({
        name: getTextInLanguage('tabs.debug.linter-logs.name'),
        desc: richDescription(getTextInLanguage('tabs.debug.linter-logs.description')),
        render: (setting) => {
          setting.addTextArea((cb) => {
            cb.inputEl.readOnly = true;
            cb.setValue(logsFromLastRun.join('\n'));
            cb.inputEl.addClass('linter-debug-readonly');
          });
        },
      });
    }

    return {
      type: 'page',
      name: getTextInLanguage(tabNameKeys.Debug),
      items,
    };
  }
}
