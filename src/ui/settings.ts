import {App, PluginSettingTab, SearchComponent, Setting} from 'obsidian';
import LinterPlugin from 'src/main';
import {LintCommand, Rule, rules} from 'src/rules';
import {moment} from 'obsidian';
import CommandSuggester from './suggesters/command-suggester';
import {SearchOptionInfo} from 'src/option';

type settingSearchInfo = {tabName: string, containerEl: HTMLDivElement, name: string, description: string, options: SearchOptionInfo[], alias?: string}
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
  private searchSettingInfo: settingSearchInfo[] = [];

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

    this.createTabAndContent('General', navEl, settingsEl, !this.selectedTab || this.selectedTab === 'General', (el: HTMLElement) => this.generateGeneralSettings(el));

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

    this.createTabAndContent('Custom Commands', navEl, settingsEl, this.selectedTab === 'Custom Commands', (el: HTMLElement) => this.generateCustomCommandSettings(el));
    this.generateSearchBar(linterHeader);
  }

  createTabAndContent(tabName: string, navEl: HTMLElement, containerEl: HTMLElement, displayTabContent: boolean = false, generateTabContent?: (el: HTMLElement) => void) {
    const tabEl = navEl.createDiv('linter-navigation-item');
    tabEl.setText(tabName);
    tabEl.onclick = () => {
      if (this.selectedTab == tabName) {
        return;
      }

      tabEl.addClass('linter-navigation-item-selected');
      this.tabContent.get(tabName).content.style.display = 'block';

      const tabInfo = this.tabContent.get(this.selectedTab);
      tabInfo.navButton.removeClass('linter-navigation-item-selected');
      tabInfo.content.style.display = 'none';

      this.selectedTab = tabName;
    };

    const tabContent = containerEl.createDiv('linter-tab-settings');
    tabContent.id = tabName.toLowerCase().replace(' ', '-');
    if (!displayTabContent) {
      tabContent.style.display = 'none';
    } else {
      tabEl.addClass('linter-navigation-item-selected');
    }

    if (generateTabContent) {
      generateTabContent(tabContent);
    }

    this.tabContent.set(tabName, {content: tabContent, heading: null, navButton: tabEl});
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

    this.searchSettingInfo.push({tabName: tabName, containerEl: ruleDiv, name: rule.name.toLowerCase(), description: rule.description.toLowerCase(), options: optionInfo ?? null, alias: ruleDiv.id});
  }

  generateCustomCommandSettings(containerEl: HTMLElement): void {
    containerEl.createEl('p', {text: `Custom commands are Obsidian commands that get run after the linter is finished running its regular rules.
    This means that they do not run before the yaml timestamp logic runs, so they can cause yaml timestamp to be triggered on the next run of the linter.
    You may only select an Obsidian command once. Note that this currently only works on linting the current file.`});
    containerEl.createEl('p', {text: `When selecting an option, make sure to select the option either by using the mouse or by hitting the enter key.
    Other selection methods may not work and only selections of an actual Obsidian command or an empty string will be saved.`}).style.color = '#EED202';

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

  generateGeneralSettings(containerEl: HTMLElement) {
    new Setting(containerEl)
        .setName('Lint on save')
        .setDesc('Lint the file on manual save (when `Ctrl + S` is pressed or when `:w` is executed while using vim keybindings)')
        .addToggle((toggle) => {
          toggle
              .setValue(this.plugin.settings.lintOnSave)
              .onChange(async (value) => {
                this.plugin.settings.lintOnSave = value;
                await this.plugin.saveSettings();
              });
        });

    new Setting(containerEl)
        .setName('Display message on lint')
        .setDesc('Display the number of characters changed after linting')
        .addToggle((toggle) => {
          toggle
              .setValue(this.plugin.settings.displayChanged)
              .onChange(async (value) => {
                this.plugin.settings.displayChanged = value;
                await this.plugin.saveSettings();
              });
        });

    new Setting(containerEl)
        .setName('Folders to ignore')
        .setDesc('Folders to ignore when linting all files or linting on save. Enter folder paths separated by newlines')
        .addTextArea((textArea) => {
          textArea
              .setValue(this.plugin.settings.foldersToIgnore.join('\n'))
              .onChange(async (value) => {
                this.plugin.settings.foldersToIgnore = value.split('\n');
                await this.plugin.saveSettings();
              });
        });

    const sysLocale = navigator.language?.toLowerCase();

    new Setting(containerEl)
        .setName('Override locale')
        .setDesc(
            'Set this if you want to use a locale different from the default',
        )
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
  }

  generateSearchBar(containerEl: HTMLElement) {
    // based on https://github.com/valentine195/obsidian-settings-search/blob/master/src/main.ts#L294-L308
    const searchSetting = new Setting(containerEl);
    searchSetting.settingEl.style.border = 'none';
    searchSetting.addSearch((s: SearchComponent) => {
      this.search = s;
    });

    this.search.onChange((value: string) => {
      const searchVal = value.toLowerCase();
      for (const settingInfo of this.searchSettingInfo) {
        // check the more common things first and then make sure to search the options since it will be slower to do that
        if (settingInfo?.alias.includes(searchVal) || settingInfo.description.includes(searchVal) || settingInfo.name.includes(searchVal)) {
          console.log(settingInfo.alias);
        } else if (settingInfo.options) {
          for (const optionInfo of settingInfo.options) {
            if (optionInfo.description.toLowerCase().includes(searchVal) || optionInfo.name.toLowerCase().includes(searchVal)) {
              console.log(settingInfo.alias);
              break;
            } else if (optionInfo.options) {
              for (const optionsForOption of optionInfo.options) {
                if (optionsForOption.description.toLowerCase().includes(searchVal) || optionsForOption.value.toLowerCase().includes(searchVal)) {
                  console.log(settingInfo.alias);
                  break;
                }
              }
            }
          }
        }
      }
    });
  }
}
