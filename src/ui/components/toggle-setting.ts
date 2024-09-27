import {Setting} from 'obsidian';
import LinterPlugin from 'src/main';
import {LinterSettingsKeys} from 'src/settings-data';
import {BaseSetting} from './base-setting';
import {LanguageStringKey} from 'src/lang/helpers';

export class ToggleSetting extends BaseSetting<boolean> {
  setting: Setting;
  constructor(containerEl: HTMLDivElement, name: LanguageStringKey, description: LanguageStringKey, keyToUpdate: LinterSettingsKeys, plugin: LinterPlugin) {
    super(containerEl, name, description, keyToUpdate, plugin);
    this.display();
  }

  display() {
    this.setting = new Setting(this.containerEl)
        .addToggle((toggle) => {
          toggle
              .setValue(this.getBoolean())
              .onChange(async (value) => {
                void this.saveValue(value);
              });
        });

    this.parseNameAndDescription();
  }
}
