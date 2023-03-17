import log from 'loglevel';
import LinterPlugin from 'src/main';
import {Tab} from './tab';
import {Setting} from 'obsidian';
import {TextBoxFull} from 'src/ui/components/text-box-full';
import {parseTextToHTMLWithoutOuterParagraph} from 'src/ui/helpers';
import {logsFromLastRun, setLogLevel} from 'src/utils/logger';
import {getTextInLanguage, LanguageStringKey} from 'src/lang/helpers';

const logLevels = Object.keys(log.levels) as string[];
const logLevelInts = Object.values(log.levels);

export class DebugTab extends Tab {
  constructor(navEl: HTMLElement, settingsEl: HTMLElement, isMobile: boolean, plugin: LinterPlugin) {
    super(navEl, settingsEl, 'Debug', isMobile, plugin);
    this.display();
  }

  display(): void {
    let tempDiv = this.contentEl.createDiv();
    let settingName = getTextInLanguage('tabs.debug.log-level.name');
    let settingDesc = getTextInLanguage('tabs.debug.log-level.description');
    new Setting(tempDiv)
        .setName(settingName)
        .setDesc(settingDesc)
        .addDropdown((dropdown) => {
          logLevels.forEach((logLevel, index) => {
            dropdown.addOption(logLevelInts[index], getTextInLanguage('enums.' + logLevel as LanguageStringKey));
          });
          // set value only takes strings so I have to cast the log level to type string in order to get it to work properly
          dropdown.setValue(this.plugin.settings.logLevel + '');
          dropdown.onChange(async (value) => {
            let parsedInt = parseInt(value);
            if (isNaN(parsedInt)) {
              parsedInt = log.levels.ERROR;
            }

            setLogLevel(parsedInt);
            this.plugin.settings.logLevel = parsedInt;
            await this.plugin.saveSettings();
          });
        });

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);

    tempDiv = this.contentEl.createDiv();
    settingName = getTextInLanguage('tabs.debug.linter-config.name');
    settingDesc = getTextInLanguage('tabs.debug.linter-config.description');
    const configDisplay = new TextBoxFull(tempDiv, settingName, settingDesc);
    configDisplay.inputEl.setText(JSON.stringify(this.plugin.settings, null, 2));

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);

    tempDiv = this.contentEl.createDiv();
    settingName = getTextInLanguage('tabs.debug.log-collection.name');
    settingDesc = getTextInLanguage('tabs.debug.log-collection.description');
    const setting = new Setting(tempDiv)
        .setName(settingName)
        .addToggle((toggle) => {
          toggle
              .setValue(this.plugin.settings.recordLintOnSaveLogs)
              .onChange(async (value) => {
                this.plugin.settings.recordLintOnSaveLogs = value;
                await this.plugin.saveSettings();
              });
        });

    parseTextToHTMLWithoutOuterParagraph(settingDesc, setting.descEl);

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);

    tempDiv = this.contentEl.createDiv();
    settingName = getTextInLanguage('tabs.debug.linter-logs.name');
    settingDesc = getTextInLanguage('tabs.debug.linter-logs.description');
    const logDisplay = new TextBoxFull(tempDiv, settingName, '');
    logDisplay.inputEl.setText(logsFromLastRun.join('\n'));

    parseTextToHTMLWithoutOuterParagraph(settingDesc, logDisplay.descEl);

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);
  }
}
