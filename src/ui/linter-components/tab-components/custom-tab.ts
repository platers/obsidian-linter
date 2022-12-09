import LinterPlugin from 'src/main';
import {Tab} from './tab';
import {CustomCommandOption} from '../custom-command-option';
import {CustomReplaceOption} from '../custom-replace-option';
import {App} from 'obsidian';

export class CustomTab extends Tab {
  constructor(navEl: HTMLElement, settingsEl: HTMLElement, isMobile: boolean, private app: App, plugin: LinterPlugin) {
    super(navEl, settingsEl, 'Custom', isMobile, plugin);
    this.display();
  }

  display(): void {
    const customCommandEl = this.contentEl.createDiv();
    const customCommands = new CustomCommandOption(customCommandEl, this.plugin.settings.lintCommands, this.isMobile, this.app, () => {
      this.plugin.saveSettings();
    });
    this.addSettingSearchInfo(customCommandEl, customCommands.name, customCommands.description.replaceAll('\n', ' ') + customCommands.warning.replaceAll('\n', ' '));

    const customReplaceEl = this.contentEl.createDiv();
    const customRegexes = new CustomReplaceOption(customReplaceEl, this.plugin.settings.customRegexes, this.isMobile, () => {
      this.plugin.saveSettings();
    });

    this.addSettingSearchInfo(customReplaceEl, customRegexes.name, customRegexes.description.replaceAll('\n', ' ') + customRegexes.warning.replaceAll('\n', ' '));
  }
}
