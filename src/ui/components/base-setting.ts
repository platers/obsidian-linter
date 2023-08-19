import {Setting} from 'obsidian';
import LinterPlugin from 'src/main';
import {DEFAULT_SETTINGS, LinterSettings, LinterSettingsKeys} from 'src/settings-data';
import {getString, getBoolean, getNumber} from 'src/utils/nested-keyof';
import {parseTextToHTMLWithoutOuterParagraph} from '../helpers';

export abstract class BaseSetting<T> {
  setting: Setting;
  constructor(public containerEl: HTMLElement, protected name: string, protected description: string, protected keyToUpdate: LinterSettingsKeys, protected plugin: LinterPlugin) {}

  async saveValue(value: T) {
    const keys = this.keyToUpdate.split('.');
    if (keys.length === 2) {
      // @ts-ignore allows for updating an arbitrary nested property
      this.plugin.settings[keys[0]][keys[1]] = value;
    } else {
      // @ts-ignore allows for updating an arbitrary property
      this.plugin.settings[this.keyToUpdate] = value;
    }

    if (this.keyToUpdate === 'linterLocale') {
      await this.plugin.setOrUpdateMomentInstance();
    }

    await this.plugin.saveSettings();
  }

  getDefaultValue() {
    const keys = this.keyToUpdate.split('.');
    if (keys.length === 2) {
      // @ts-ignore allows for grabbing an arbitrary nested property
      return DEFAULT_SETTINGS[keys[0]][keys[1]];
    } else {
      // @ts-ignore allows for grabbing an arbitrary property
      return DEFAULT_SETTINGS[this.keyToUpdate];
    }
  }

  getString(): string {
    return getString<LinterSettings>(this.plugin.settings, this.keyToUpdate) ?? this.getDefaultValue();
  }

  getBoolean(): boolean {
    return getBoolean<LinterSettings>(this.plugin.settings, this.keyToUpdate) ?? this.getDefaultValue();
  }

  getNumber(): number {
    return getNumber<LinterSettings>(this.plugin.settings, this.keyToUpdate) ?? this.getDefaultValue();
  }

  protected parseNameAndDescription() {
    parseTextToHTMLWithoutOuterParagraph(this.name, this.setting.nameEl, this.plugin.settingsTab.component);
    parseTextToHTMLWithoutOuterParagraph(this.description, this.setting.descEl, this.plugin.settingsTab.component);
  }

  abstract display(): void;
}
