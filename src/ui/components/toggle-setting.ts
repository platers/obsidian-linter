import {Setting} from 'obsidian';
import LinterPlugin from 'src/main';
import {LinterSettingsKeys} from 'src/settings-data';
import {BaseSetting} from './base-setting';

export class ToggleSetting extends BaseSetting<boolean> {
  setting: Setting;
  constructor(containerEl: HTMLDivElement, name: string, description: string, keyToUpdate: LinterSettingsKeys, plugin: LinterPlugin) {
    super(containerEl, name, description, keyToUpdate, plugin);
    this.display();
  }

  display() {
    this.setting = new Setting(this.containerEl)
        .addToggle((toggle) => {
          toggle
              .setValue(this.getBoolean())
              .onChange(async (value) => {
                this.saveValue(value);
              });
        });

    this.parseNameAndDescription();
  }
}
