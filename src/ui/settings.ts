import {App, PluginSettingTab, SearchComponent, Setting} from 'obsidian';
import LinterPlugin from 'src/main';
import {LintCommand, Rule, rules} from 'src/rules';
import {moment} from 'obsidian';
import CommandSuggester from './suggesters/command-suggester';
import {SearchOptionInfo} from 'src/option';

type settingSearchInfo = {containerEl: HTMLDivElement, name: string, description: string, options: SearchOptionInfo[], alias?: string}
type TabContentInfo = {content: HTMLDivElement, heading: HTMLElement, navButton: HTMLElement}

// const yamlRuleTypeToIconName: Record<RuleType, string> = {
//   [RuleType.YAML]: 'three-horizontal-bars',
//   [RuleType.CONTENT]: 'lines-of-text',
//   [RuleType.FOOTNOTE]: 'box-glyph',
//   [RuleType.HEADING]: 'heading-glyph',
//   [RuleType.SPACING]: 'up-and-down-arrows',
// };

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

    const linterHeader = containerEl.createDiv('linter-setting-title');
    linterHeader.createEl('h1').setText('Linter');

    const navEl = containerEl.createEl('nav', {cls: 'linter-setting-header'}).createDiv('linter-setting-tab-group');
    const settingsEl = containerEl.createDiv('linter-setting-content');

    this.createTabAndContent('General', navEl, settingsEl, !this.selectedTab || this.selectedTab === 'General', (el: HTMLElement) => this.generateGeneralSettings('General', el));

    let prevSection = '';
    let tabTitle = '';

    for (const rule of rules) {
      if (rule.type !== prevSection) {
        tabTitle = rule.type;
        this.createTabAndContent(tabTitle, navEl, settingsEl, this.selectedTab === tabTitle);
        prevSection = rule.type;
      }

      this.addRuleToTab(tabTitle, rule);
    }

    this.createTabAndContent('Custom Commands', navEl, settingsEl, this.selectedTab === 'Custom Commands', (el: HTMLElement) => this.generateCustomCommandSettings('Custom Commands', el));
    this.generateSearchBar(linterHeader);
    this.createSearchZeroState(settingsEl);
  }

  createTabAndContent(tabName: string, navEl: HTMLElement, containerEl: HTMLElement, displayTabContent: boolean = false, generateTabContent?: (el: HTMLElement) => void) {
    const tabEl = navEl.createDiv('linter-navigation-item');
    tabEl.setText(tabName);
    tabEl.onclick = () => {
      if (this.selectedTab == tabName) {
        return;
      }

      tabEl.addClass('linter-navigation-item-selected');
      const tab = this.tabContent.get(tabName);
      tab.content.style.display = 'block';

      if (this.selectedTab != '') {
        const tabInfo = this.tabContent.get(this.selectedTab);
        tabInfo.navButton.removeClass('linter-navigation-item-selected');
        tabInfo.content.style.display = 'none';
      } else {
        this.searchZeroState.style.display = 'none';

        for (const settingTab of this.searchSettingInfo) {
          for (const setting of settingTab[1]) {
            setting.containerEl.style.display = 'block';
          }
        }

        for (const tabInfo of this.tabContent) {
          const tab = tabInfo[1];
          tab.heading.style.display = 'none';
          if (tabName !== tabInfo[0]) {
            tab.content.style.display = 'none';
          }
        }
      }

      this.selectedTab = tabName;
    };

    const tabContent = containerEl.createDiv('linter-tab-settings');
    const tabHeader = tabContent.createEl('h2', {text: tabName + ' Settings'});
    tabHeader.style.display = 'none';

    tabContent.id = tabName.toLowerCase().replace(' ', '-');
    if (!displayTabContent) {
      tabContent.style.display = 'none';
    } else {
      tabEl.addClass('linter-navigation-item-selected');
    }

    if (generateTabContent) {
      generateTabContent(tabContent);
    }

    this.tabContent.set(tabName, {content: tabContent, heading: tabHeader, navButton: tabEl});
  }

  addRuleToTab(tabName: string, rule: Rule) {
    const containerEl = this.tabContent.get(tabName).content;
    if (containerEl == null) {
      return;
    }

    const ruleDiv = containerEl.createDiv();
    ruleDiv.id = rule.alias();
    ruleDiv.createEl('h3', {}, (el) => {
      el.innerHTML = `<a href="${rule.getURL()}">${rule.name}</a>`;
    });

    const optionInfo = [] as SearchOptionInfo[];
    for (const option of rule.options) {
      option.display(ruleDiv, this.plugin.settings, this.plugin);
      optionInfo.push(option.searchInfo);
    }

    this.addSettingToMasterSettingsList(tabName, ruleDiv, rule.name.toLowerCase(), rule.description.toLowerCase(), optionInfo, ruleDiv.id);
  }

  generateCustomCommandSettings(tabName: string, containerEl: HTMLElement): void {
    const descriptionP1 = `Custom commands are Obsidian commands that get run after the linter is finished running its regular rules.
    This means that they do not run before the yaml timestamp logic runs, so they can cause yaml timestamp to be triggered on the next run of the linter.
    You may only select an Obsidian command once. Note that this currently only works on linting the current file.`;
    const descriptionP2 = `When selecting an option, make sure to select the option either by using the mouse or by hitting the enter key.
    Other selection methods may not work and only selections of an actual Obsidian command or an empty string will be saved.`;

    this.addSettingToMasterSettingsList(tabName, containerEl as HTMLDivElement, tabName.toLowerCase(), descriptionP1.replaceAll('\n', ' ') + descriptionP2.replaceAll('\n', ' '));

    containerEl.createEl('p', {text: descriptionP1});
    containerEl.createEl('p', {text: descriptionP2}).style.color = '#EED202';

    function arrayMove(arr: LintCommand[], fromIndex: number, toIndex: number):void {
      if (toIndex < 0 || toIndex === arr.length) {
        return;
      }
      const element = arr[fromIndex];
      arr[fromIndex] = arr[toIndex];
      arr[toIndex] = element;
    }

    new Setting(containerEl)
        .addButton((cb)=>{
          cb.setButtonText('Add new command')
              .setCta()
              .onClick(()=>{
                this.plugin.settings.lintCommands.push({id: '', name: ''});
                this.plugin.saveSettings();
                this.display();
                const customCommandInputBox = document.getElementsByClassName('linter-custom-command');
                // @ts-ignore
                customCommandInputBox[customCommandInputBox.length-1].focus();
              });
        });

    this.plugin.settings.lintCommands.forEach((command, index) => {
      new Setting(containerEl)
          .addSearch((cb) => {
            new CommandSuggester(this.app, cb.inputEl, this.plugin.settings.lintCommands);
            cb.setPlaceholder('Obsidian command')
                .setValue(command.name)
                .onChange((newCommandName) => {
                  const newCommand = {id: cb.inputEl.getAttribute('commandId'), name: newCommandName};

                  // make sure that the command is valid before making any attempt to save the value
                  if (newCommand.name && newCommand.id) {
                    this.plugin.settings.lintCommands[index] = newCommand;
                    this.plugin.saveSettings();
                  } else if (!newCommand.name && !newCommand.id) { // the value has been cleared out
                    this.plugin.settings.lintCommands[index] = newCommand;
                    this.plugin.saveSettings();
                  }
                });
            cb.inputEl.setAttr('tabIndex', index);
            cb.inputEl.addClass('linter-custom-command');
          })
          .addExtraButton((cb) => {
            cb.setIcon('up-chevron-glyph')
                .setTooltip('Move up')
                .onClick(() => {
                  arrayMove(this.plugin.settings.lintCommands, index, index-1);
                  this.plugin.saveSettings();
                  this.display();
                });
          })
          .addExtraButton((cb) => {
            cb.setIcon('down-chevron-glyph')
                .setTooltip('Move down')
                .onClick(() => {
                  arrayMove(this.plugin.settings.lintCommands, index, index+1);
                  this.plugin.saveSettings();
                  this.display();
                });
          })
          .addExtraButton((cb)=>{
            cb.setIcon('cross')
                .setTooltip('Delete')
                .onClick(()=>{
                  this.plugin.settings.lintCommands.splice(index, 1);
                  this.plugin.saveSettings();
                  this.display();
                });
          });
    });
  }

  generateGeneralSettings(tabName: string, containerEl: HTMLElement) {
    let tempDiv = containerEl.createDiv();
    let settingName = 'Lint on save';
    let settingDesc = 'Lint the file on manual save (when `Ctrl + S` is pressed or when `:w` is executed while using vim keybindings)';
    new Setting(tempDiv)
        .setName(settingName)
        .setDesc(settingDesc)
        .addToggle((toggle) => {
          toggle
              .setValue(this.plugin.settings.lintOnSave)
              .onChange(async (value) => {
                this.plugin.settings.lintOnSave = value;
                await this.plugin.saveSettings();
              });
        });

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
        tab.content.style.display = 'block';
        tab.heading.style.display = 'block';

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

  private searchSettings(searchVal: string) {
    const tabsWithSettings = new Set<string>();
    for (const tabSettingInfo of this.searchSettingInfo) {
      const tabName = tabSettingInfo[0];
      const tabSettings = tabSettingInfo[1];
      for (const settingInfo of tabSettings) {
        // check the more common things first and then make sure to search the options since it will be slower to do that
        // Note: we check for an empty string for searchVal to see if the search is essentially empty which will display all rules
        if (searchVal.trim() === '' || settingInfo.alias?.includes(searchVal) || settingInfo.description.includes(searchVal) || settingInfo.name.includes(searchVal)) {
          console.log(settingInfo.name);
          settingInfo.containerEl.style.display = 'block';

          if (!tabsWithSettings.has(tabName)) {
            tabsWithSettings.add(tabName);
          }
        } else if (settingInfo.options) {
          for (const optionInfo of settingInfo.options) {
            if (optionInfo.description.toLowerCase().includes(searchVal) || optionInfo.name.toLowerCase().includes(searchVal)) {
              settingInfo.containerEl.style.display = 'block';

              if (!tabsWithSettings.has(tabName)) {
                tabsWithSettings.add(tabName);
              }
              break;
            } else if (optionInfo.options) {
              for (const optionsForOption of optionInfo.options) {
                if (optionsForOption.description.toLowerCase().includes(searchVal) || optionsForOption.value.toLowerCase().includes(searchVal)) {
                  settingInfo.containerEl.style.display = 'block';

                  if (!tabsWithSettings.has(tabName)) {
                    tabsWithSettings.add(tabName);
                  }
                  break;
                }
              }
            }

            settingInfo.containerEl.style.display = 'none';
          }
        } else {
          settingInfo.containerEl.style.display = 'none';
        }
      }
    }

    // display any headings that have setting results and hide any that do not
    for (const tabInfo of this.tabContent) {
      let display = 'none';
      if (tabsWithSettings.has(tabInfo[0])) {
        display = 'block';
      }

      tabInfo[1].heading.style.display = display;
    }

    if (tabsWithSettings.size === 0) {
      this.searchZeroState.style.display = 'block';
    } else {
      this.searchZeroState.style.display = 'none';
    }
  }

  private createSearchZeroState(containerEl: HTMLElement) {
    this.searchZeroState = containerEl.createDiv();
    this.searchZeroState.style.display = 'none';
    this.searchZeroState.createEl('h2', {text: 'No settings match search'}).style.textAlign = 'center';
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
