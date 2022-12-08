import {App, Platform, PluginSettingTab, SearchComponent, setIcon, Setting} from 'obsidian';
import LinterPlugin from 'src/main';
import {Rule, rules, RuleType} from 'src/rules';
import {moment} from 'obsidian';
import {SearchOptionInfo} from 'src/option';
import {iconInfo} from 'src/ui/icons';
import {hideEl, parseTextToHTMLWithoutOuterParagraph, unhideEl} from './helpers';
import {NormalArrayFormats, SpecialArrayFormats, TagSpecificArrayFormats} from 'src/utils/yaml';
import {CustomCommandOption} from './linter-components/custom-command-option';
import {CustomReplaceOption} from './linter-components/custom-replace-option';

type settingSearchInfo = {containerEl: HTMLDivElement, name: string, description: string, options: SearchOptionInfo[], alias?: string}
type TabContentInfo = {content: HTMLDivElement, heading: HTMLElement, navButton: HTMLElement}

const tabNameToTabIconId: Record<string | RuleType, string> = {
  'General': iconInfo.general.id,
  'Custom': iconInfo.custom.id,
  'YAML': iconInfo.yaml.id,
  'Heading': iconInfo.heading.id,
  'Footnote': iconInfo.footer.id,
  'Content': iconInfo.content.id,
  'Spacing': iconInfo.whitespace.id,
  'Paste': iconInfo.paste.id,
};

export class SettingTab extends PluginSettingTab {
  plugin: LinterPlugin;
  private tabContent: Map<string, TabContentInfo> = new Map<string, TabContentInfo>();
  private selectedTab: string = 'General';
  private search: SearchComponent;
  private searchSettingInfo: Map<string, settingSearchInfo[]> = new Map();
  private searchZeroState: HTMLDivElement;

  constructor(app: App, plugin: LinterPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const {containerEl} = this;

    containerEl.empty();

    this.generateSettingsTitle(containerEl, Platform.isMobile);

    // const navContainer = containerEl.createEl('nav', {cls: 'linter-setting-header'});
    // const navEl = navContainer.createDiv('linter-setting-tab-group');
    // const settingsEl = containerEl.createDiv('linter-setting-content');

    this.createTabAndContent('General', navEl, settingsEl, (el: HTMLElement, tabName: string) => this.generateGeneralSettings(tabName, el));

    let prevSection = '';
    let tabTitle = '';
    for (const rule of rules) {
      if (rule.type !== prevSection) {
        tabTitle = rule.type;
        this.createTabAndContent(tabTitle, navEl, settingsEl);
        prevSection = rule.type;
      }

      this.addRuleToTab(tabTitle, rule);
    }

    this.createTabAndContent('Custom', navEl, settingsEl, (el: HTMLElement, tabName: string) => this.generateCustomSettings(tabName, el));

    this.createSearchZeroState(settingsEl);
  }

  // createTabAndContent(tabName: string, navEl: HTMLElement, containerEl: HTMLElement, generateTabContent?: (el: HTMLElement, tabName: string) => void) {
  //   const displayTabContent = this.selectedTab === tabName;
  //   const tabEl = navEl.createDiv('linter-navigation-item');

  //   let tabClass = 'linter-desktop';
  //   if (Platform.isMobile) {
  //     tabClass = 'linter-mobile';
  //   }

  //   tabEl.addClass(tabClass);
  //   setIcon(tabEl.createSpan({cls: 'linter-navigation-item-icon'}), tabNameToTabIconId[tabName], 20);
  //   tabEl.createSpan().setText(tabName);

  //   tabEl.onclick = () => {
  //     if (this.selectedTab == tabName) {
  //       return;
  //     }

  //     tabEl.addClass('linter-navigation-item-selected');
  //     const tab = this.tabContent.get(tabName);
  //     unhideEl(tab.content);

  //     if (this.selectedTab != '') {
  //       const tabInfo = this.tabContent.get(this.selectedTab);
  //       tabInfo.navButton.removeClass('linter-navigation-item-selected');
  //       hideEl(tabInfo.content);
  //     } else {
  //       hideEl(this.searchZeroState);


  //       for (const settingTab of this.searchSettingInfo) {
  //         for (const setting of settingTab[1]) {
  //           unhideEl(setting.containerEl);
  //         }
  //       }

  //       for (const tabInfo of this.tabContent) {
  //         const tab = tabInfo[1];
  //         hideEl(tab.heading);
  //         if (tabName !== tabInfo[0]) {
  //           hideEl(tab.content);
  //         }
  //       }
  //     }

  //     this.selectedTab = tabName;
  //   };

  //   const tabContent = containerEl.createDiv('linter-tab-settings');

  //   const tabHeader = tabContent.createEl('h2', {text: tabName + ' Settings'});
  //   hideEl(tabHeader);

  //   tabContent.id = tabName.toLowerCase().replace(' ', '-');
  //   if (!displayTabContent) {
  //     hideEl(tabContent);
  //   } else {
  //     tabEl.addClass('linter-navigation-item-selected');
  //   }

  //   if (generateTabContent) {
  //     generateTabContent(tabContent, tabName);
  //   }

  //   this.tabContent.set(tabName, {content: tabContent, heading: tabHeader, navButton: tabEl});
  // }

  addRuleToTab(tabName: string, rule: Rule) {
    const containerEl = this.tabContent.get(tabName).content;
    if (containerEl == null) {
      return;
    }

    const ruleDiv = containerEl.createDiv();
    ruleDiv.id = rule.alias();
    ruleDiv.createEl(Platform.isMobile ? 'h4' : 'h3', {}, (el) => {
      el.innerHTML = `<a href="${rule.getURL()}">${rule.name}</a>`;
    });

    const optionInfo = [] as SearchOptionInfo[];
    for (const option of rule.options) {
      option.display(ruleDiv, this.plugin.settings, this.plugin);
      optionInfo.push(option.searchInfo);
    }

    this.addSettingToMasterSettingsList(tabName, ruleDiv, rule.name.toLowerCase(), rule.description.toLowerCase(), optionInfo, ruleDiv.id);
  }

  generateCustomSettings(tabName: string, containerEl: HTMLElement): void {
    const customCommandEl = containerEl.createDiv();

    const customCommands = new CustomCommandOption(customCommandEl, this.plugin.settings.lintCommands, Platform.isMobile, this.app, () => {
      this.plugin.saveSettings();
    });
    1;
    this.addSettingToMasterSettingsList(tabName, customCommandEl, customCommands.name, customCommands.description.replaceAll('\n', ' ') + customCommands.warning.replaceAll('\n', ' '));

    const customReplaceEl = containerEl.createDiv();

    const customRegexes = new CustomReplaceOption(customReplaceEl, this.plugin.settings.customRegexes, Platform.isMobile, this.app, () => {
      this.plugin.saveSettings();
    });

    this.addSettingToMasterSettingsList(tabName, customReplaceEl, customRegexes.name, customRegexes.description.replaceAll('\n', ' ') + customRegexes.warning.replaceAll('\n', ' '));
  }

  generateGeneralSettings(tabName: string, containerEl: HTMLElement) {
    let tempDiv = containerEl.createDiv();
    let settingName = 'Lint on save';
    let settingDesc = 'Lint the file on manual save (when `Ctrl + S` is pressed or when `:w` is executed while using vim keybindings)';
    const setting = new Setting(tempDiv)
        .setName(settingName)
        .addToggle((toggle) => {
          toggle
              .setValue(this.plugin.settings.lintOnSave)
              .onChange(async (value) => {
                this.plugin.settings.lintOnSave = value;
                await this.plugin.saveSettings();
              });
        });

    parseTextToHTMLWithoutOuterParagraph(settingDesc, setting.descEl);

    this.addSettingToMasterSettingsList(tabName, tempDiv, settingName, settingDesc);

    tempDiv = containerEl.createDiv();
    settingName = 'Display message on lint';
    settingDesc = 'Display the number of characters changed after linting';
    new Setting(tempDiv)
        .setName(settingName)
        .setDesc(settingDesc)
        .addToggle((toggle) => {
          toggle
              .setValue(this.plugin.settings.displayChanged)
              .onChange(async (value) => {
                this.plugin.settings.displayChanged = value;
                await this.plugin.saveSettings();
              });
        });

    this.addSettingToMasterSettingsList(tabName, tempDiv, settingName, settingDesc);

    tempDiv = containerEl.createDiv();
    settingName = 'Folders to ignore';
    settingDesc = 'Folders to ignore when linting all files or linting on save. Enter folder paths separated by newlines';
    new Setting(tempDiv)
        .setName(settingName)
        .setDesc(settingDesc)
        .addTextArea((textArea) => {
          textArea
              .setValue(this.plugin.settings.foldersToIgnore.join('\n'))
              .onChange(async (value) => {
                this.plugin.settings.foldersToIgnore = value.split('\n');
                await this.plugin.saveSettings();
              });
        });

    this.addSettingToMasterSettingsList(tabName, tempDiv, settingName, settingDesc);

    const sysLocale = navigator.language?.toLowerCase();

    tempDiv = containerEl.createDiv();
    settingName = 'Override locale';
    settingDesc = 'Set this if you want to use a locale different from the default';
    new Setting(tempDiv)
        .setName(settingName)
        .setDesc(settingDesc)
        .addDropdown((dropdown) => {
          dropdown.addOption('system-default', `Same as system (${sysLocale})`);
          moment.locales().forEach((locale) => {
            dropdown.addOption(locale, locale);
          });
          dropdown.setValue(this.plugin.settings.linterLocale);
          dropdown.onChange(async (value) => {
            this.plugin.settings.linterLocale = value;
            await this.plugin.setOrUpdateMomentInstance();
            await this.plugin.saveSettings();
          });
        });

    this.addSettingToMasterSettingsList(tabName, tempDiv, settingName, settingDesc);

    const yamlAliasRecords = [
      // as types is needed to allow for the proper types as options otherwise it assumes it has to be the specific enum value
      NormalArrayFormats.MultiLine as NormalArrayFormats | SpecialArrayFormats,
      NormalArrayFormats.SingleLine,
      SpecialArrayFormats.SingleStringCommaDelimited,
      SpecialArrayFormats.SingleStringToSingleLine,
      SpecialArrayFormats.SingleStringToMultiLine,
    ];

    tempDiv = containerEl.createDiv();
    settingName = 'YAML aliases section style';
    settingDesc = 'The style of the YAML aliases section';
    new Setting(tempDiv)
        .setName(settingName)
        .setDesc(settingDesc)
        .addDropdown((dropdown) => {
          yamlAliasRecords.forEach((aliasRecord) => {
            dropdown.addOption(aliasRecord, aliasRecord);
          });
          dropdown.setValue(this.plugin.settings.commonStyles.aliasArrayStyle);
          dropdown.onChange(async (value) => {
            this.plugin.settings.commonStyles.aliasArrayStyle = value as NormalArrayFormats | SpecialArrayFormats;
            await this.plugin.saveSettings();
          });
        });

    this.addSettingToMasterSettingsList(tabName, tempDiv, settingName, settingDesc);

    const yamlTagRecords = [
      NormalArrayFormats.MultiLine as TagSpecificArrayFormats | NormalArrayFormats | SpecialArrayFormats,
      NormalArrayFormats.SingleLine,
      SpecialArrayFormats.SingleStringToSingleLine,
      SpecialArrayFormats.SingleStringToMultiLine,
      TagSpecificArrayFormats.SingleLineSpaceDelimited,
      TagSpecificArrayFormats.SingleStringSpaceDelimited,
      SpecialArrayFormats.SingleStringCommaDelimited,
    ];

    tempDiv = containerEl.createDiv();
    settingName = 'YAML tags section style';
    settingDesc = 'The style of the YAML tags section';
    new Setting(tempDiv)
        .setName(settingName)
        .setDesc(settingDesc)
        .addDropdown((dropdown) => {
          yamlTagRecords.forEach((tagRecord) => {
            dropdown.addOption(tagRecord, tagRecord);
          });
          dropdown.setValue(this.plugin.settings.commonStyles.tagArrayStyle);
          dropdown.onChange(async (value) => {
            this.plugin.settings.commonStyles.tagArrayStyle = value as TagSpecificArrayFormats | NormalArrayFormats | SpecialArrayFormats;
            await this.plugin.saveSettings();
          });
        });

    this.addSettingToMasterSettingsList(tabName, tempDiv, settingName, settingDesc);

    const escapeCharRecords = ['"', '\''];

    tempDiv = containerEl.createDiv();
    settingName = 'Default Escape Character';
    settingDesc = 'The default character to use to escape YAML values when a single quote and double quote are not present.';
    new Setting(tempDiv)
        .setName(settingName)
        .setDesc(settingDesc)
        .addDropdown((dropdown) => {
          escapeCharRecords.forEach((escapeChar) => {
            dropdown.addOption(escapeChar, escapeChar);
          });
          dropdown.setValue(this.plugin.settings.commonStyles.escapeCharacter);
          dropdown.onChange(async (value) => {
            this.plugin.settings.commonStyles.escapeCharacter = value;
            await this.plugin.saveSettings();
          });
        });

    this.addSettingToMasterSettingsList(tabName, tempDiv, settingName, settingDesc);

    tempDiv = containerEl.createDiv();
    settingName = 'Number of Dollar Signs to Indicate Math Block';
    settingDesc = 'The amount of dollar signs to consider the math content to be a math block instead of inline math';
    new Setting(tempDiv)
        .setName(settingName)
        .setDesc(settingDesc)
        .addText((textbox) => {
          textbox
              .setValue(this.plugin.settings.commonStyles.minimumNumberOfDollarSignsToBeAMathBlock.toString())
              .onChange(async (value) => {
                let parsedInt = parseInt(value);
                if (isNaN(parsedInt)) {
                  parsedInt = 2;
                }

                this.plugin.settings.commonStyles.minimumNumberOfDollarSignsToBeAMathBlock = parsedInt;
                await this.plugin.saveSettings();
              });
        });

    this.addSettingToMasterSettingsList(tabName, tempDiv, settingName, settingDesc);
  }

  generateSearchBar(containerEl: HTMLElement) {
    // based on https://github.com/valentine195/obsidian-settings-search/blob/master/src/main.ts#L294-L308
    const searchSetting = new Setting(containerEl);
    searchSetting.settingEl.style.border = 'none';
    searchSetting.addSearch((s: SearchComponent) => {
      this.search = s;
    });

    this.search.setPlaceholder('Search all settings');

    this.search.inputEl.onfocus = () => {
      for (const tabInfo of this.tabContent) {
        const tab = tabInfo[1];
        tab.navButton.removeClass('linter-navigation-item-selected');
        unhideEl(tab.content);
        unhideEl(tab.heading);

        const searchVal = this.search.getValue();
        if (this.selectedTab == '' && searchVal.trim() != '') {
          this.searchSettings(searchVal.toLowerCase());
        }

        this.selectedTab = '';
      }
    };

    this.search.onChange((value: string) => {
      this.searchSettings(value.toLowerCase());
    });
  }

  private generateSettingsTitle(containerEl: HTMLElement, isMobile: boolean) {
    const linterHeader = containerEl.createDiv('linter-setting-title');
    if (isMobile) {
      linterHeader.addClass('linter-mobile');
    } else {
      linterHeader.createEl('h1').setText('Linter');
    }

    this.generateSearchBar(linterHeader);
  }

  private searchSettings(searchVal: string) {
    const tabsWithSettingsInSearchResults = new Set<string>();
    const that = this;
    const showSearchResultAndAddTabToResultList = function(settingContainer: HTMLElement, tabName: string) {
      that.unhideEl(settingContainer);

      if (!tabsWithSettingsInSearchResults.has(tabName)) {
        tabsWithSettingsInSearchResults.add(tabName);
      }
    };

    for (const tabSettingInfo of this.searchSettingInfo) {
      const tabName = tabSettingInfo[0];
      const tabSettings = tabSettingInfo[1];
      for (const settingInfo of tabSettings) {
        // check the more common things first and then make sure to search the options since it will be slower to do that
        // Note: we check for an empty string for searchVal to see if the search is essentially empty which will display all rules
        if (searchVal.trim() === '' || settingInfo.alias?.includes(searchVal) || settingInfo.description.includes(searchVal) || settingInfo.name.includes(searchVal)) {
          showSearchResultAndAddTabToResultList(settingInfo.containerEl, tabName);
        } else if (settingInfo.options) {
          for (const optionInfo of settingInfo.options) {
            if (optionInfo.description.toLowerCase().includes(searchVal) || optionInfo.name.toLowerCase().includes(searchVal)) {
              showSearchResultAndAddTabToResultList(settingInfo.containerEl, tabName);

              break;
            } else if (optionInfo.options) {
              for (const optionsForOption of optionInfo.options) {
                if (optionsForOption.description.toLowerCase().includes(searchVal) || optionsForOption.value.toLowerCase().includes(searchVal)) {
                  showSearchResultAndAddTabToResultList(settingInfo.containerEl, tabName);

                  break;
                }
              }
            }

            hideEl(settingInfo.containerEl);
          }
        } else {
          hideEl(settingInfo.containerEl);
        }
      }
    }

    // display any headings that have setting results and hide any that do not
    for (const tabInfo of this.tabContent) {
      if (tabsWithSettingsInSearchResults.has(tabInfo[0])) {
        unhideEl(tabInfo[1].heading);
      } else {
        hideEl(tabInfo[1].heading);
      }
    }

    if (tabsWithSettingsInSearchResults.size === 0) {
      unhideEl(this.searchZeroState);
    } else {
      hideEl(this.searchZeroState);
    }
  }

  private createSearchZeroState(containerEl: HTMLElement) {
    this.searchZeroState = containerEl.createDiv();
    hideEl(this.searchZeroState);
    this.searchZeroState.createEl(Platform.isMobile ? 'h3' : 'h2', {text: 'No settings match search'}).style.textAlign = 'center';
  }

  private addSettingToMasterSettingsList(tabName: string, containerEl: HTMLDivElement, name: string = '', description: string = '', options: SearchOptionInfo[] = null, alias: string = null) {
    const settingInfo = {containerEl: containerEl, name: name.toLowerCase(), description: description.toLowerCase(), options: options, alias: alias};

    if (!this.searchSettingInfo.has(tabName)) {
      this.searchSettingInfo.set(tabName, [settingInfo]);
    } else {
      this.searchSettingInfo.get(tabName).push(settingInfo);
    }
  }
}
